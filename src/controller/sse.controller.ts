import { Request, Response } from 'express';
import SseService from '../services/sse.service';

class SseController {
  private sseService: SseService;

  constructor() {
    this.sseService = new SseService();
  }

  async register(req: Request, res: Response) {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({message: 'Token is required'});
      return;
    }

    await this.sseService.registerClient(token, res);
  }

  async getUserInfo(req: Request, res: Response) {
    const {token: id} = req.params;
    const newFact = req.body;

    await this.sseService.sendInfoToClient(id, newFact, res);
  }
}

export default SseController;
