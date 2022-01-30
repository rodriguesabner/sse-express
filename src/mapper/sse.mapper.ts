import Cache from '../vendor/cache';

class SseMapper {
  private cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async find(clientId: string): Promise<any> {
    const data = await this.cache.get(clientId);
    return data;
  }

  async save(opts: any) {
    const data = await this.cache.set(opts.token, {
      clientId: opts.token,
      readStream: () => opts.readStream,
    });

    return data;
  }

  async delete(clientId: string) {
    const data = await this.cache.del(clientId);
    return data;
  }
}

export default SseMapper;
