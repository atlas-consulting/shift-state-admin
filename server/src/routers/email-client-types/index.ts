import { Application, Router } from "express";
import * as middleware from "./middleware";
import { IConfig, http } from "../../core";
import { EmailClientType } from "../../entities/EmailClientType";
import { EmailClientTypesRoutes } from "./types";

export const mount = (applicaton: Application, config: IConfig) => {
  config.LOGGER.info("Mounting EmailClientType Router");
  const emailClientTypeRouter = Router();
  emailClientTypeRouter
    .get(EmailClientTypesRoutes.EMAIL_CLIENT_TYPES, async (req, res) => {
      config.LOGGER.info("Requesting all EmailClientTypes");
      const emailClientTypes = await EmailClientType.find();
      http.handleResponse(res, http.StatusCode.OK, emailClientTypes);
    })
    .post(
      EmailClientTypesRoutes.EMAIL_CLIENT_TYPES,
      middleware.validateCreateEmailClientType,
      async (req, res) => {
        config.LOGGER.info("Creating new EmailClientType");
        const newEmailClientType = await EmailClientType.create({
          ...req.body,
        } as EmailClientType).save();
        http.handleResponse(res, http.StatusCode.CREATED, newEmailClientType);
      }
    );
  applicaton.use(emailClientTypeRouter);
};
