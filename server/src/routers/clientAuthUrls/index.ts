import { Application, Router } from "express";
import { ClientAuthUrlRoutes } from "./types";
import { validateGetClientAuthUrl } from "./middleware";
import { VERIFY_TOKEN } from "../auth/strategies";
import { EmailClientRoutes } from "../emailClient/types";
import { IConfig, http } from "../../core";
import {
  ClientType,
  getAuthUrl,
  parseClientType,
} from "../../services/clientAuthUrl";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting ClientAuthUrl Router");
  const clientUrlRouter = Router();
  clientUrlRouter.get(
    ClientAuthUrlRoutes.CLIENT_AUTH_URL,
    VERIFY_TOKEN,
    validateGetClientAuthUrl,
    async (req, res) => {
      let authUrl;
      const type = parseClientType(req.params.clientType);
      // !TODO: Refactor to a different pattern, perhaps Strategy
      switch (type) {
        case ClientType.GMAIL:
          authUrl = await getAuthUrl(
            type,
            config.G_CLIENT_ID,
            config.G_CLIENT_SECRET,
            `http://${req.headers.host}${EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS}`,
            req.params
          );
          break;
        case ClientType.OFFICE:
          authUrl = await getAuthUrl(
            type,
            config.MS_CLIENT_ID,
            config.MS_CLIENT_SECRET,
            `http://${req.headers.host}${EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS}`,
            req.params
          );
      }
      http.handleResponse(res, http.StatusCode.OK, { authUrl });
    }
  );
  application.use(clientUrlRouter);
};
