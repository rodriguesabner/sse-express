import express, { Application } from 'express';
import SseRoute from './sse.route';

class Routes {
  public app: Application;

  private routeSSE: SseRoute;

  constructor() {
    this.app = express();
    this.routeSSE = new SseRoute();
    this.routes();
  }

  routes() {
    this.app.use('/sse', this.routeSSE.router);
  }
}

export default Routes;
