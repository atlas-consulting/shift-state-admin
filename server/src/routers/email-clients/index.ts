import { Application, Router } from "express";
import { EmailClientRoutes } from "./types";
import {
  validateCreateEmailClient,
  validateApplyFilterToEmailClient,
  validateEmailClientFilters,
} from "./middleware";
import { createDELETEEmailClient, createGETClientCredentials, createGETEmailClient, createGETEmailClientFilters, createGETEmailClients, createPOSTEmailClientFilter, createPOSTEmailClients } from "./handlers";
import { IConfig } from "../../core";
import { VERIFY_TOKEN } from "../auth/strategies";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting EmailClient Router");
  const emailClientRouter = Router();
  emailClientRouter
    .get(EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS, createGETClientCredentials(config))
    .get(EmailClientRoutes.EMAIL_CLIENT, VERIFY_TOKEN, createGETEmailClient(config))
    .get(EmailClientRoutes.EMAIL_CLIENTS, VERIFY_TOKEN, createGETEmailClients(config))
    .get(
      EmailClientRoutes.EMAIL_CLIENT_FILTERS,
      VERIFY_TOKEN,
      validateEmailClientFilters,
      createGETEmailClientFilters(config)
    )
    .delete(EmailClientRoutes.EMAIL_CLIENT, VERIFY_TOKEN, createDELETEEmailClient(config))
    .post(
      EmailClientRoutes.EMAIL_CLIENTS,
      VERIFY_TOKEN,
      validateCreateEmailClient,
      createPOSTEmailClients(config)
    )
    .post(
      EmailClientRoutes.EMAIL_CLIENT_FILTERS,
      VERIFY_TOKEN,
      validateApplyFilterToEmailClient,
      createPOSTEmailClientFilter(config)
    )
  application.use(emailClientRouter);
};
