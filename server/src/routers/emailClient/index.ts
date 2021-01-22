import { Application, Router } from "express";
import { EmailClientRoutes } from "./types";
import {
  validateCreateEmailClient,
  validateApplyFilterToEmailClient,
  validateEmailClientFilters,
} from "./middleware";
import { VERIFY_TOKEN } from "../auth/strategies";
import { EmailClient } from "../../entities/EmailClient";
import { IConfig, http } from "../../core";
import { EmailClientFilter } from "../../entities/EmailClientFilter";
import { Equal } from "typeorm";
import { EMAIL_CLIENT_FILTERS } from "./schema";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting EmailClient Router");
  const emailClientRouter = Router();
  emailClientRouter
    .get(EmailClientRoutes.EMAIL_CLIENT, VERIFY_TOKEN, async (req, res) => {})
    .get(EmailClientRoutes.EMAIL_CLIENTS, VERIFY_TOKEN, async (req, res) => {
      config.LOGGER.info("Requesting all EmailClients");
      const emailClients = await EmailClient.find({
        relations: ["type"],
      });
      http.handleResponse(res, http.StatusCode.OK, emailClients);
    })
    .post(
      EmailClientRoutes.EMAIL_CLIENTS,
      VERIFY_TOKEN,
      validateCreateEmailClient,
      async (req, res) => {
        config.LOGGER.info("Creating new EmailClient");
        const newEmailClient = await EmailClient.create({
          ...req.body,
        } as EmailClient).save();
        http.handleResponse(res, http.StatusCode.CREATED, newEmailClient);
      }
    )
    .get(
      EmailClientRoutes.EMAIL_CLIENT_FILTERS,
      VERIFY_TOKEN,
      validateEmailClientFilters,
      async (req, res) => {
        const { emailClientId } = await EMAIL_CLIENT_FILTERS.validate({
          ...req.params,
          ...req.body,
        });
        const emailClientFilters = await EmailClientFilter.find({
          join: {
            alias: "emailClientFilter",
            innerJoinAndSelect: {
              filter: "emailClientFilter.filter",
              emailClient: "emailClientFilter.emailClient",
            },
          },
          where: {
            emailClientId: Equal(emailClientId),
          },
        });
        // const filters = await emailClient?.connectedFilters;
        http.handleResponse(res, http.StatusCode.OK, emailClientFilters);
      }
    )
    .post(
      EmailClientRoutes.EMAIL_CLIENT_FILTERS,
      VERIFY_TOKEN,
      validateApplyFilterToEmailClient,
      async (req, res) => {
        await EmailClientFilter.create({
          ...req.params,
          ...req.body,
        } as EmailClientFilter).save();
        http.handleResponse(res, http.StatusCode.CREATED);
      }
    );
  application.use(emailClientRouter);
};
