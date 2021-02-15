/**
 * @module emailProvider.authentication
 */
import { Maybe } from 'true-myth';
import { google } from 'googleapis'
import * as msal from '@azure/msal-node'
import { EmailProviderAuthConfig, EmailProvider, EmailProviderAuthRequest, AuthRequest, AuthURLRequest, EmailProviderTypes, AuthTokenRequest } from "./types";


/**
 * 
 * @param config 
 */
export function buildAuthModule(config: EmailProviderAuthConfig) {
    const AUTH_CLIENTS = {
        google: buildGoogleAuthProvider(EmailProvider.GMAIL, config),
        office: buildMicrosoftAuthProvider(EmailProvider.OFFICE, config)
    }
    async function handleAuthUrlRequest(request: AuthURLRequest<EmailProviderTypes>, authClient: typeof AUTH_CLIENTS) {
        switch (request.provider) {
            case 'gmail':
                return authClient.google.generateAuthUrl({
                    access_type: 'offline',
                    state: JSON.stringify(request.state || {}),
                    scope: config.gmail.scopes,
                    redirect_uri: `${request.scheme}://${request.host}:${request.port}${config.gmail.redirectUrl}`
                })
            case 'office365':
                return await authClient.office.getAuthCodeUrl({
                    scopes: config.office365.scopes,
                    state: JSON.stringify(request.state || {}),
                    redirectUri: `${request.scheme}://${request.host}:${request.port}${config.office365.redirectUrl}`
                })
        }
    }
    async function handleTokenRequest(request: AuthTokenRequest<EmailProviderTypes>, authclient: typeof AUTH_CLIENTS) {
        switch (request.provider) {
            case EmailProvider.OFFICE:
                await authclient.office.acquireTokenByCode({
                    code: request.code,
                    scopes: config.office365.scopes,
                    redirectUri: `${request.scheme}://${request.host}:${request.port}${config.office365.redirectUrl}`,
                }).then(token => {
                    request.callback(Maybe.fromNullable(token))
                })
                break;
            case EmailProvider.GMAIL:
                console.info('Attempting to get token for Gmail client with the following code.')
                console.info('------------------------------------------------>')
                console.info(request.code)
                console.info("".padStart(request.code.length, '-'))
                authclient.google.getToken({ redirect_uri: `${request.scheme}://${request.host}:${request.port}${config.gmail.redirectUrl}`, code: request.code }, (error, token) => {
                    console.log(error)
                    request.callback(Maybe.fromNullable(token))
                })
                break;
        }
    }
    return {
        async execute(request: EmailProviderAuthRequest) {
            switch (request.type) {
                case AuthRequest.REQUEST_AUTH_TOKEN:
                    return handleTokenRequest(request as AuthTokenRequest<EmailProviderTypes>, AUTH_CLIENTS)
                case AuthRequest.REQUEST_AUTH_URL:
                    return handleAuthUrlRequest(request as AuthURLRequest<EmailProviderTypes>, AUTH_CLIENTS)
            }
        }
    }
}



function buildMicrosoftAuthProvider(provider: EmailProvider.OFFICE, config: EmailProviderAuthConfig) {
    const { [provider]: { clientId, clientSecret } } = config
    const auth = new msal.ConfidentialClientApplication({
        auth: {
            clientId,
            clientSecret
        }
    })
    return auth
}

function buildGoogleAuthProvider(provider: EmailProvider.GMAIL, config: EmailProviderAuthConfig) {
    const { [provider]: { clientId, clientSecret } } = config
    return new google.auth.OAuth2(clientId, clientSecret)
}