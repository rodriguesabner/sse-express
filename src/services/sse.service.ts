import { Response } from 'express';
import EventEmitter from 'events';
import SseMapper from '../mapper/sse.mapper';

class SseService {
  private emitter: EventEmitter;

  private readonly sseMapper: SseMapper;

  private clients: any[];

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.sseMapper = new SseMapper();
    this.clients = [];
  }

  async registerClient(token: string, res: Response): Promise<void> {
    SseService.configureHeadersNotExpires(res);

    const currentClient = await this.sseMapper.find(token);
    if (currentClient == null) {
      const toStore = {
        token,
        res,
      };

      this.clients.push(toStore);
      await this.sseMapper.save(toStore);
    }

    this.configureEventEmitter();
  }

  private static configureHeadersNotExpires(res: Response): void {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    };

    res.writeHead(200, headers);
  }

  private configureEventEmitter() {
    this.emitter.once('newOrder', async (order) => {
      const redisCurrentClient = await this.sseMapper.find(order.clientId);
      const currentClientLocal = this.clients.find(
        (client) => client.token === order.clientId,
      );

      if (redisCurrentClient == null) {
        return;
      }

      if (order.clientId === redisCurrentClient.clientId) {
        try {
          // @ts-ignore
          redisCurrentClient.res.write(`data: ${JSON.stringify(order.order)}\n\n`);
        } catch (error) {
          currentClientLocal.res.write(`data: ${JSON.stringify(order.order)}\n\n`);
        } finally {
          await this.sseMapper.delete(order.clientId);
        }
      }
    });
  }

  async sendInfoToClient(id: string, orderData: any, res: Response): Promise<any> {
    const data = {
      clientId: id,
      order: orderData,
      counter: 0,
    };

    res.status(200).json(data);
    this.emitter.emit('newOrder', data);
  }
}

export default SseService;
