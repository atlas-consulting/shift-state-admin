import { Application, Router } from "express";
import { ClientAuthUrlRoutes } from "./types";
import { buildGetClientAuthURLHandler } from './handlers'
import { validateGetClientAuthUrl } from "./middleware";
import { VERIFY_TOKEN } from "../auth/strategies";
import { IConfig } from "../../core";



export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting ClientAuthUrl Router");
  const clientUrlRouter = Router();
  clientUrlRouter.get(
    ClientAuthUrlRoutes.CLIENT_AUTH_URL,
    VERIFY_TOKEN,
    validateGetClientAuthUrl,
    buildGetClientAuthURLHandler(config)
  );
  application.use(clientUrlRouter);
};
