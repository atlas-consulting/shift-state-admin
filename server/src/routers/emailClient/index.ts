import { Maybe } from "true-myth";
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
import {
  EMAIL_CLIENT_FILTERS,
  EMAIL_CLIENT_STATE,
  EMAIL_CLIENT_QUERY,
} from "./schema";
import { getClientToken, parseClientType } from "../../services/clientAuthUrl";
import { GMAIL_CLIENT_TOKEN } from "../clientAuthUrls/schema";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting EmailClient Router");
  const emailClientRouter = Router();
  emailClientRouter
    // ! Really needs a clean up
    .get(EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS, async (req, res) => {
      config.LOGGER.info("Callback Url request", req.url);
      config.LOGGER.info("Attempting to extract client access code");
      config.LOGGER.info("------------------------------------------->");
      try {
        const { state, code } = await EMAIL_CLIENT_QUERY.validate(req.query);
        config.LOGGER.info("Extracted client code");
        config.LOGGER.info("Attempting to parse state data");
        const data = JSON.parse(state);
        const {
          emailClientId,
          clientType: unsafeClientType,
        } = await EMAIL_CLIENT_STATE.validate(data);
        const clientType = parseClientType(unsafeClientType);
        config.LOGGER.info("Requesting access token");
        getClientToken(
          clientType,
          config.CLIENT_ID,
          config.CLIENT_SECRET,
          `http://${req.headers.host}${EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS}`,
          code,
          (token) => {
            token.match({
              Just: async (token) => {
                config.LOGGER.info(
                  `Received token, applying to specified emailClient ${emailClientId}`
                );
                const emailClient = await EmailClient.findOne(
                  {
                    id: emailClientId,
                  },
                  { relations: ["type"] }
                );
                Maybe.fromNullable(emailClient).match({
                  Just: async (emailClient) => {
                    const {
                      access_token,
                      refresh_token,
                    } = await GMAIL_CLIENT_TOKEN.validate(token);
                    emailClient.accessToken = access_token;
                    emailClient.refreshToken = refresh_token;
                    await emailClient.save();
                    http.handleResponse(res, http.StatusCode.OK, emailClient);
                  },
                  Nothing: () => {
                    http.handleResponse(
                      res,
                      http.StatusCode.NOT_FOUND,
                      null,
                      `Failed to locate Email Client ${emailClientId}`
                    );
                  },
                });
              },
              Nothing: () => {
                http.handleResponse(
                  res,
                  http.StatusCode.INTERNAL_SERVER_ERROR,
                  null,
                  "Failed to request token"
                );
              },
            });
          }
        );
      } catch (error) {
        http.handleResponse(
          res,
          http.StatusCode.INTERNAL_SERVER_ERROR,
          null,
          undefined,
          error
        );
      }
      config.LOGGER.info("------------------------------------------->");
    })
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
