import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { Application, RequestHandler, json, urlencoded } from "express";
import * as connection from "./connection";
import { getConnection } from "typeorm";
interface ServerLifecycleFn {
  (config: IConfig): void | Promise<void | unknown>;
}

interface RouterFn {
  (application: Application): void;
}
export interface IConfig {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  LOGGER: Console;
  ROUTER_FNS: RouterFn[];
  MIDDLEWARE: RequestHandler[];
  BEFORE_SERVER_START_FN: ServerLifecycleFn[];
  AFTER_SERVER_START_FN: ServerLifecycleFn[];
}

export const DEFAULT_CONFIG: IConfig = {
  NODE_ENV: (process.env.NODE_ENV as IConfig["NODE_ENV"]) || "development",
  PORT: ((process.env.PORT as unknown) as number) || 8080,
  LOGGER: console,
  ROUTER_FNS: [],
  MIDDLEWARE: [
    cors({ origin: "*" }),
    helmet(),
    compression(),
    json(),
    urlencoded({ extended: false }),
    morgan("combined"),
  ],
  BEFORE_SERVER_START_FN: [connection.connect],
  AFTER_SERVER_START_FN: [
    ({ LOGGER, NODE_ENV, PORT }) =>
      LOGGER.info(`Server running in mode: [${NODE_ENV}] on port: [${PORT}]`),
  ],
};

const ConfigManager = (config = DEFAULT_CONFIG) => {
  return {
    config,
    getConfig() {
      return this.config;
    },
    addRouter(...routers: RouterFn[]) {
      this.config = {
        ...this.config,
        ROUTER_FNS: [...this.config.ROUTER_FNS, ...routers],
      };
      return this;
    },
    addMiddleware(...middleware: RequestHandler[]) {
      this.config = {
        ...this.config,
        MIDDLEWARE: [...this.config.MIDDLEWARE, ...middleware],
      };
      return this;
    },
  };
};

export default ConfigManager;
