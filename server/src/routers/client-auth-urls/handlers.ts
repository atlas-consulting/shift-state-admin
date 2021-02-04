import { Request, Response } from "express";
import { IConfig, http } from "../../core";
import * as EmailProvider from '../../services/email-provider'
import { AuthRequest } from "../../services/email-provider/types";

export function buildGetClientAuthURLHandler(config: IConfig) {
    return async (req: Request, res: Response) => {
        const { emailClientId } = req.params
        const provider = await EmailProvider.parse(req.params.clientType)
        const authRequest = {
            provider,
            type: AuthRequest.REQUEST_AUTH_URL,
            scheme: req.protocol,
            host: req.hostname,
            port: config.PORT,
            state: {
                emailClientId,
                clientType: provider
            }
        }
        config.LOGGER.info(authRequest)
        const authUrl = await EmailProvider.auth.execute({
            provider,
            type: AuthRequest.REQUEST_AUTH_URL,
            scheme: req.protocol,
            host: req.hostname,
            port: config.PORT,
            state: {
                emailClientId,
                clientType: provider
            }
        })
        config.LOGGER.info('Auth URL Generated')
        config.LOGGER.info(JSON.stringify(authUrl))
        http.handleResponse(res, http.StatusCode.OK, { authUrl });
    }
}