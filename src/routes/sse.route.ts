import { Router } from 'express';
import SseController from '../controller/sse.controller';

class SseRoute {
  public router: Router;

  private readonly controller: SseController;

  constructor() {
    this.controller = new SseController();
    this.router = Router();

    this.routes();
  }

  public routes() {
    this.router.get(
      '/:token',
      this.controller.register.bind(this.controller),
    );

    this.router.post(
      '/:token',
      this.controller.getUserInfo.bind(this.controller),
    );
  }
}

export default SseRoute;
