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
import {
  ClientType,
  getClientToken,
  parseClientType,
  applyFilter,
} from "../../services/clientAuthUrl";
import { GMAIL_CLIENT_TOKEN, MS_CLIENT_TOKEN } from "../clientAuthUrls/schema";
import { Filter } from "../../entities/Filter";

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
        config.LOGGER.info(data);
        const {
          emailClientId,
          clientType: unsafeClientType,
        } = await EMAIL_CLIENT_STATE.validate(data);
        const clientType = parseClientType(unsafeClientType);
        config.LOGGER.info("Requesting access token");
        switch (clientType) {
          case ClientType.OFFICE:
            getClientToken(
              clientType,
              config.MS_CLIENT_ID,
              config.MS_CLIENT_SECRET,
              `http://${req.headers.host}${EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS}`,
              code,
              (token) => {
                token.match({
                  Just: async (token) => {
                    config.LOGGER.info(token as any);
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
                        const { accessToken } = await MS_CLIENT_TOKEN.validate(
                          token
                        );
                        emailClient.accessToken = accessToken;
                        await emailClient.save();
                        res.redirect("/");
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
            break;
          case ClientType.GMAIL:
            getClientToken(
              clientType,
              config.G_CLIENT_ID,
              config.G_CLIENT_SECRET,
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
                        res.redirect("/");
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
        }
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
    .get(EmailClientRoutes.EMAIL_CLIENT, VERIFY_TOKEN, async (req, res) => {
      config.LOGGER.info("Requesting all EmailClients");
      const emailClient = await EmailClient.findOne(req.params.emailClientId, {
        relations: ["type", "connectedFilters"],
      });
      http.handleResponse(res, http.StatusCode.OK, emailClient);
    })
    .get(EmailClientRoutes.EMAIL_CLIENTS, VERIFY_TOKEN, async (req, res) => {
      config.LOGGER.info("Requesting all EmailClients");
      try {
        const emailClients = await EmailClient.find({
          relations: ["type", "connectedFilters"],
        });
        http.handleResponse(res, http.StatusCode.OK, emailClients);
      } catch (err) {
        http.handleResponse(
          res,
          http.StatusCode.INTERNAL_SERVER_ERROR,
          null,
          undefined,
          err
        );
      }
    })
    .post(
      EmailClientRoutes.EMAIL_CLIENTS,
      VERIFY_TOKEN,
      validateCreateEmailClient,
      async (req, res) => {
        config.LOGGER.info("Creating new EmailClient");
        config.LOGGER.info("------------------------>");
        config.LOGGER.info(req.body);
        config.LOGGER.info("------------------------>");
        try {
          const newEmailClient = await EmailClient.create({
            ...req.body,
          } as EmailClient).save();
          http.handleResponse(res, http.StatusCode.CREATED, newEmailClient);
        } catch (err) {
          http.handleResponse(
            res,
            http.StatusCode.INTERNAL_SERVER_ERROR,
            null,
            undefined,
            err
          );
        }
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
        const emailClient = await EmailClient.findOne(
          req.params.emailClientId,
          { relations: ["type"] }
        );
        const filter = await Filter.findOne(req.body.filterId);
        try {
          await applyFilter(
            filter!,
            emailClient!,
            emailClient!.type.description
          );
          await EmailClientFilter.create({
            ...req.params,
            ...req.body,
          } as EmailClientFilter).save();
          http.handleResponse(res, http.StatusCode.CREATED);
        } catch (error) {
          config.LOGGER.info(error);
          http.handleResponse(
            res,
            http.StatusCode.INTERNAL_SERVER_ERROR,
            null,
            undefined,
            error
          );
        }
      }
    )
    .delete(EmailClientRoutes.EMAIL_CLIENT, VERIFY_TOKEN, async (req, res) => {
      try {
        await EmailClient.delete({ id: parseInt(req.params.emailClientId) });
        http.handleResponse(res, http.StatusCode.OK);
      } catch (error) {
        config.LOGGER.info(error);
        http.handleResponse(
          res,
          http.StatusCode.INTERNAL_SERVER_ERROR,
          null,
          undefined,
          error
        );
      }
    });
  application.use(emailClientRouter);
};
