import { Request, Response } from 'express'
import { EMAIL_CLIENT_FILTERS, EMAIL_CLIENT_QUERY, EMAIL_CLIENT_STATE } from './schema';
import { EmailClient } from '../../entities/EmailClient'
import { http, IConfig } from "../../core";
import * as EmailProvider from '../../services/email-provider'
import { AuthRequest, FilterRequest } from '../../services/email-provider/types';
import { EmailClientFilter } from '../../entities/EmailClientFilter';
import { Equal } from 'typeorm';
import { Filter } from '../../entities/Filter';

export function createGETClientCredentials(config: IConfig) {
    return async (req: Request, res: Response) => {
        config.LOGGER.info("Callback Url request", req.url);
        config.LOGGER.info("Attempting to extract client access code");
        config.LOGGER.info("------------------------------------------->");
        const { state, code } = await EMAIL_CLIENT_QUERY.validate(req.query)
        config.LOGGER.info("Extracted client code");
        config.LOGGER.info("Attempting to parse state data");
        const data = JSON.parse(state)
        config.LOGGER.info(data);
        const {
            emailClientId,
            clientType: unsafeClientType,
        } = await EMAIL_CLIENT_STATE.validate(data);
        const provider = await EmailProvider.parse(unsafeClientType)
        EmailProvider.auth.execute({
            provider,
            code,
            scheme: req.protocol,
            host: req.hostname,
            port: config.PORT,
            type: AuthRequest.REQUEST_AUTH_TOKEN,
            callback: (async response => {
                response.match({
                    Just: async (token) => {
                        config.LOGGER.info(
                            `Received token, applying to specified emailClient ${emailClientId}`
                        );
                        await EmailClient.addToken(emailClientId, provider, token)
                        res.redirect("/");
                    },
                    Nothing: () => {
                        http.handleResponse(
                            res,
                            http.StatusCode.INTERNAL_SERVER_ERROR,
                            null,
                            "Failed to request token"
                        );
                    }
                })
            })
        })
        config.LOGGER.info("------------------------------------------->");
    }
}

export function createGETEmailClient(config: IConfig) {
    return async (req: Request, res: Response) => {
        config.LOGGER.info("Requesting all EmailClients");
        const emailClient = await EmailClient.findOne(req.params.emailClientId, {
            relations: ["type", "connectedFilters"],
        });
        http.handleResponse(res, http.StatusCode.OK, emailClient);
    }
}

export function createGETEmailClients(config: IConfig) {
    return async (req: Request, res: Response) => {
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
    }
}

export function createPOSTEmailClients(config: IConfig) {
    return async (req: Request, res: Response) => {
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
}

export function createGETEmailClientFilters(config: IConfig) {
    return async (req: Request, res: Response) => {
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
        http.handleResponse(res, http.StatusCode.OK, emailClientFilters);
    }
}

export function createDELETEEmailClient(config: IConfig) {
    return async (req: Request, res: Response) => {
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
    }
}


export function createPOSTEmailClientFilter(config: IConfig) {
    return async (req: Request, res: Response) => {
        const emailClient = await EmailClient.findOne(
            req.params.emailClientId,
            { relations: ["type"] }
        );
        const filter = await Filter.findOne(req.body.filterId);
        try {
            const provider = await EmailProvider.parse(emailClient!.type.description)
            EmailProvider.filters.execute({
                provider,
                emailClient: emailClient!,
                filterConfiguration: filter!.filterConfiguration,
                type: FilterRequest.APPLY_FILTER_REQUEST,
                accessToken: emailClient!.accessToken
            })
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
}