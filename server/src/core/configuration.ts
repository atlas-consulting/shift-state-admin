import pino from "pino";
import expressPinoLogger from "express-pino-logger";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { Application, RequestHandler, json, urlencoded } from "express";
import * as orm from "./orm";

/* ---------------------------------- Types --------------------------------- */
interface ServerLifecycleFn {
  (config: IConfig): void | Promise<void | unknown>;
}

interface RouterFn {
  (application: Application, configuration: IConfig): void;
}
export interface IConfig {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  LOGGER: pino.BaseLogger;
  ROUTER_FNS: RouterFn[];
  MIDDLEWARE: RequestHandler[];
  BEFORE_SERVER_START_FN: ServerLifecycleFn[];
  AFTER_SERVER_START_FN: ServerLifecycleFn[];
  APP_SECRET: string;
}

/* -------------------------------- Constants ------------------------------- */
export const DEFAULT_CONFIG: IConfig = {
  APP_SECRET: process.env.APP_SECRET || "SEKRET_KAT",
  NODE_ENV: (process.env.NODE_ENV as IConfig["NODE_ENV"]) || "development",
  PORT: ((process.env.PORT as unknown) as number) || 8080,
  LOGGER: pino(),
  ROUTER_FNS: [],
  MIDDLEWARE: [
    cors({ origin: "*" }),
    helmet(),
    compression(),
    json(),
    urlencoded({ extended: false }),
    expressPinoLogger({ prettyPrint: true }),
  ],
  BEFORE_SERVER_START_FN: [orm.connect],
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
