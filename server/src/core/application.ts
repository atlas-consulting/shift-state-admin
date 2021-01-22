/**
 * @module core.application
 */
import path from "path";
import express, { Application } from "express";
import { IConfig } from "./configuration";
import { handleResponse, StatusCode } from "./http";

/* -------------------------------- Constants ------------------------------- */

const BUILD_DIR = path.resolve(__dirname, "../../../build");
const APP = express();

/* ----------------------------- Module Members ----------------------------- */
export const initialize = (configuration: IConfig): Application => {
  configuration.LOGGER.info("Initializing express application");
  configuration.LOGGER.info("Mounting Middleware");
  configuration.MIDDLEWARE.forEach((middleware) => {
    APP.use(middleware);
  });
  configuration.LOGGER.info("Mounting Routers");
  configuration.ROUTER_FNS.forEach((routerFns) => {
    routerFns(APP, configuration);
  });
  APP.use(express.static(BUILD_DIR));
  APP.use("/api/*", (req, res) => {
    handleResponse(res, StatusCode.NOT_FOUND);
  });
  APP.use("*", (req, res) => {
    res.sendFile(path.join(BUILD_DIR, "index.html"));
  });
  return APP;
};

export default APP;
