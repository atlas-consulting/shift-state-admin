import { Application, Router } from "express";
import { ClientAuthUrlRoutes } from "./types";
import { validateGetClientAuthUrl } from "./middleware";
import { VERIFY_TOKEN } from "../auth/strategies";
import { EmailClientRoutes } from "../emailClient/types";
import { IConfig, http } from "../../core";
import { getAuthUrl, parseClientType } from "../../services/clientAuthUrl";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting ClientAuthUrl Router");
  const clientUrlRouter = Router();
  clientUrlRouter.get(
    ClientAuthUrlRoutes.CLIENT_AUTH_URL,
    VERIFY_TOKEN,
    validateGetClientAuthUrl,
    (req, res) => {
      const type = parseClientType(req.params.clientType);
      const authUrl = getAuthUrl(
        type,
        config.CLIENT_ID,
        config.CLIENT_SECRET,
        `http://${req.headers.host}${EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS}`,
        req.params
      );
      http.handleResponse(res, http.StatusCode.OK, { authUrl });
    }
  );
  application.use(clientUrlRouter);
};
