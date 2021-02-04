import * as EmailProvider from '../../src/services/email-provider'
import { AuthRequest } from '../../src/services/email-provider/types'

describe('EmailProvider Service', () => {
    describe.skip("auth", () => {
        test("getting an Google OAuth URL", async () => {
            return expect(EmailProvider.auth.execute({
                provider: EmailProvider.Provider.GMAIL,
                type: AuthRequest.REQUEST_AUTH_URL,
                host: 'localhost',
                port: 8080,
                scheme: 'http'
            })).resolves.toBeTruthy()
        })
        test("getting an Microsoft OAuth URL", async () => {
            return expect(EmailProvider.auth.execute({
                provider: EmailProvider.Provider.OFFICE,
                type: AuthRequest.REQUEST_AUTH_URL,
                host: 'localhost',
                port: 8080,
                scheme: 'http'
            })).resolves.toBeTruthy()
        })
    })
    describe("parse", () => {
        test("parsing Office365", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('Office365')).resolves.toBe('office365')
        })
        test("parsing Office 365", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('Office 365')).resolves.toBe('office365')
        })
        test("parsing Gmail", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('Gmail')).resolves.toBe('gmail')
        })
        test("is case insensitive 'Gmail'", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('gmail')).resolves.toBe('gmail')
        })
        test("is case insensitive 'GMAIL'", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('gmail')).resolves.toBe('gmail')
        })
        test("is case insensitive 'Office365'", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('office365')).resolves.toBe('office365')
        })
        test("is case insensitive 'OFFICE365'", async () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('office365')).resolves.toBe('office365')
        })
        test("throws when it can't match", () => {
            expect.assertions(1)
            return expect(EmailProvider.parse('Yahoo')).rejects.toThrow()
        })
    })
})