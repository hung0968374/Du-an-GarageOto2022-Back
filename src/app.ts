import express, { Application, Router } from 'express';
import {
  handleCommonHttpError,
  handleRequestValidationError,
  handleServerException,
  handleRouteNotFound,
} from './common/errors';
import { logger, requestLogger } from './common/helpers/logger';

interface ExpressApplication {
  port?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleWares?: any;
  apiPrefix?: string;
  routes: Router;
}

export default class App {
  app: Application = express();
  port: number;

  constructor(appInit: ExpressApplication) {
    this.port = appInit.port;
    this.init(appInit);
  }

  private init(appInit: ExpressApplication) {
    this.middlewares(appInit.middleWares || []);
    this.initRoutes(appInit.apiPrefix || '', appInit.routes);
    this.enableLog();
    this.handleError();
  }

  private middlewares(middleWares: []) {
    for (const middleware of middleWares) {
      this.app.use(middleware);
    }
  }

  private initRoutes(apiPrefix: string, route: Router) {
    this.app.use(apiPrefix, route);
  }

  private enableLog() {
    this.app.use(requestLogger());
  }

  private handleError() {
    this.app.use(handleRouteNotFound);
    this.app.use(handleRequestValidationError);
    this.app.use(handleCommonHttpError);
    this.app.use(handleServerException);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`App is listening on port ${this.port}`);
    });
  }
}
