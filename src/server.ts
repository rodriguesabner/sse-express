import express from 'express';
import zlib from 'zlib';
import compress from 'compression';
import cors from 'cors';
import Routes from './routes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.config();
    this.routes();
  }

  config() {
    this.app.use(compress({
      // eslint-disable-next-line camelcase
      filter(content_type: any) {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      br: false,
    }));
    this.app.use(express.json());
    this.app.use(cors({ origin: '*' }));
  }

  routes() {
    this.app.use('', new Routes().app);
  }
}

export default new Server().app;
