import { Maybe } from 'true-myth'
import * as types from './types'
import * as schema from './schemas'
import { buildAuthModule } from './authentication'
import { EmailClientRoutes } from '../../routers/email-clients/types'
export * as schema from './schemas'
export * as types from './types'
export { EmailProvider as Provider } from './types'
export * as filters from './filters'

/**
 * Given a string, tries to extract a valid EmailClient type.
 * @param str 
 * @example
 *      EmailProvider.parse("Office 365") // "office365"
 */
export const parse = async (str: string): Promise<types.EmailProviderTypes> => {
    const match = [schema.GMAIL, schema.OFFICE].find(async (providerSchema) => await providerSchema.isValid(str))
    if (!match) {
        throw Error(`Unrecognized Provider ${str}`)
    }
    const result = [...types.EMAIL_PROVIDERS].find(provider => provider === str.trim().replace(" ", "").toLocaleLowerCase())
    if (!result) {
        throw Error(`Unable to parse value ${str}`)
    }
    return result
}

export const auth = buildAuthModule({
    [types.EmailProvider.GMAIL]: {
        provider: types.EmailProvider.GMAIL,
        clientId: Maybe.fromNullable(process.env.G_CLIENT_ID).unwrapOr(''),
        clientSecret: Maybe.fromNullable(process.env.G_CLIENT_SECRET).unwrapOr(''),
        redirectUrl: EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS,
        scopes: [
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.settings.basic",
        ]
    },
    [types.EmailProvider.OFFICE]: {
        provider: types.EmailProvider.OFFICE,
        clientId: Maybe.fromNullable(process.env.MS_CLIENT_ID).unwrapOr(''),
        clientSecret: Maybe.fromNullable(process.env.MS_CLIENT_SECRET).unwrapOr(''),
        redirectUrl: EmailClientRoutes.EMAIL_CLIENT_CREDENTIALS,
        scopes: [
            'MailboxSettings.ReadWrite'
        ]
    }
})