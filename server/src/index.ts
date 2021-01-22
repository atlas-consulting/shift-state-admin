/**
 * @module server
 */
import http from "http";
import { IConfig, configManager, initialize } from "./core";
import * as routers from "./routers";

const CONFIG = configManager()
  .addRouter(
    routers.authRouter.mount,
    routers.healthCheckRouter.mount,
    routers.emailClientRouter.mount,
    routers.emailClientTypesRouter.mount
  )
  .getConfig();

function startServer(configuration: IConfig): void {
  const APP = initialize(configuration);
  const server = http.createServer(APP);
  configuration.LOGGER.info("Firing Before Server Start Fns");
  configuration.BEFORE_SERVER_START_FN.forEach(
    async (fn) => await fn(configuration)
  );
  server.listen(configuration.PORT, () => {
    configuration.LOGGER.info("Firing After Server Start Fns");
    configuration.AFTER_SERVER_START_FN.forEach(
      async (fn) => await fn(configuration)
    );
  });
}

startServer(CONFIG);

export default startServer;
