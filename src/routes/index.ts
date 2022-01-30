import express, { Application } from 'express';
import SseRoute from './sse.route';

class Routes {
  public app: Application;

  constructor() {
    this.app = express();

    this.routes();
  }

  routes() {
    this.app.use('/sse', new SseRoute().router);
  }
}

export default Routes;
