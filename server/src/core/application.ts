/**
 * @module core.application
 */
import path from "path";
import express, { Application } from "express";
import { IConfig } from "./configuration";

const BUILD_DIR = path.resolve(__dirname, "../../../build");
const app = express();

export const initialize = (configuration: IConfig): Application => {
  configuration.LOGGER.info("Initializing express application");
  configuration.LOGGER.info("Mounting Middleware");
  configuration.MIDDLEWARE.forEach((middleware) => {
    app.use(middleware);
  });
  configuration.LOGGER.info("Mounting Routers");
  configuration.ROUTER_FNS.forEach((routerFns) => {
    routerFns(app);
  });
  app.use(express.static(BUILD_DIR));
  app.use("*", (req, res) => {
    res.sendFile(path.join(BUILD_DIR, "index.html"));
  });
  return app;
};

export default app;
