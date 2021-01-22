import passport from "passport";
import { Application, Router } from "express";
import { validateCreateEmailClient } from "./middleware";
import { EmailClient } from "../../entities/EmailClient";
import { IConfig, http } from "../../core";
import { EmailClientRoutes } from "./types";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting EmailClient Router");
  const emailClientRouter = Router();
  emailClientRouter
    .get(
      EmailClientRoutes.EMAIL_CLIENTS,
      passport.authenticate("verify-token", { session: false }),
      async (req, res) => {
        config.LOGGER.info("Requesting all EmailClients");
        const emailClients = await EmailClient.find({
          relations: ["type"],
        });
        http.handleResponse(res, http.StatusCode.OK, emailClients);
      }
    )
    .post(
      EmailClientRoutes.EMAIL_CLIENTS,
      passport.authenticate("verify-token", { session: false }),
      validateCreateEmailClient,
      async (req, res) => {
        config.LOGGER.info("Creating new EmailClient");
        const newEmailClient = await EmailClient.create({
          ...req.body,
        } as EmailClient).save();
        http.handleResponse(res, http.StatusCode.CREATED, newEmailClient);
      }
    );
  application.use(emailClientRouter);
};
