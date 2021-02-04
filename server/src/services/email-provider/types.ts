/**
 * @module emailProvider.types
 * 
 */

import { Maybe } from "true-myth/maybe";
import { EmailClient } from "../../entities/EmailClient";
import { Filter } from "../../entities/Filter";


/**
 * @description A list of the supported email providers
 */
export const EMAIL_PROVIDERS = <const>['gmail', 'office365']

/**
 * 
 */
export const AUTH_REQUESTS = <const>['REQUEST_AUTH_URL', 'REQUEST_AUTH_TOKEN']

export enum AuthRequest {
    REQUEST_AUTH_URL = 'REQUEST_AUTH_URL',
    REQUEST_AUTH_TOKEN = 'REQUEST_AUTH_TOKEN'
}


/**
 * 
 */
export type EmailProviderTypes = typeof EMAIL_PROVIDERS[number];

/**
 * @description A utility enum for supported email providers
 */
export enum EmailProvider {
    GMAIL = 'gmail',
    OFFICE = 'office365'
}


/* -------------------------------------------------------------------------- */
/*                                Filter Types                                */
/* -------------------------------------------------------------------------- */
export const FILTER_REQUEST_TYPES = <const>['APPLY_FILTER_REQUEST']
export const FilterRequestType = typeof FILTER_REQUEST_TYPES
export enum FilterRequest {
    APPLY_FILTER_REQUEST = 'APPLY_FILTER_REQUEST'
}

export interface ApplyFilterRequest<P> {
    provider: P,
    type: FilterRequest.APPLY_FILTER_REQUEST,
    filterConfiguration: Filter['filterConfiguration'],
    emailClient: EmailClient,
    accessToken: string
}


export type EmailFilterRequest = ApplyFilterRequest<EmailProviderTypes>

/* -------------------------------------------------------------------------- */
/*                            Authentication Types                            */
/* -------------------------------------------------------------------------- */

interface IAuthClientCredentials<P> {
    provider: P,
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
    scopes: string[]
}

/**
 * 
 */
export type GoogleAuthClientCreds = IAuthClientCredentials<EmailProvider.GMAIL>

/**
 * 
 */
export type MicrosoftAuthClientCreds = IAuthClientCredentials<EmailProvider.OFFICE>

/**
 * 
 */
export type AuthClientCredentials = GoogleAuthClientCreds | MicrosoftAuthClientCreds

/**
 * 
 */
export type EmailProviderAuthConfig = Record<EmailProvider, AuthClientCredentials>

export interface GetGoogleClientToken {
    provider: EmailProvider.GMAIL,
    code: string
}

export interface GetMicrosoftClientToken {
    provider: EmailProvider.OFFICE,
    code: string
}

export interface AuthURLRequest<T> {
    provider: T,
    type: AuthRequest.REQUEST_AUTH_URL,
    state?: Record<string, unknown>,
    scheme: string,
    host: string,
    port: number
}

export interface AuthTokenRequest<P> {
    provider: P,
    type: AuthRequest.REQUEST_AUTH_TOKEN,
    code: string,
    scheme: string,
    host: string,
    port: number,
    callback: <T>(token: Maybe<T>) => void
}


export type EmailProviderAuthRequest = AuthURLRequest<EmailProviderTypes> | AuthTokenRequest<EmailProviderTypes>