/**
 * @module server
 */
import http from "http";
import { Application } from "express";
import { configuration, application } from "./core";

function startServer(app: Application, config: configuration.IConfig): void {
  const server = http.createServer(app);
  server.listen(config.PORT, () => {
    config.LOGGER.log(
      `Server running in mode: [${config.NODE_ENV}] on port: [${config.PORT}]`
    );
  });
}

startServer(application, configuration.DEFAULT_CONFIG);

export default startServer;
