/**
 * @module EmailProvider.filters
 */
import "isomorphic-fetch";
import { google } from 'googleapis'
import { Client, AuthenticationProvider, ClientOptions } from '@microsoft/microsoft-graph-client'
import { EmailFilterRequest, FilterRequest } from "./types";

export interface FilterClause {
    type: 'AND' | 'OR';
    id: number;
    value: string
}

class ShiftStateMSAuthProvider implements AuthenticationProvider {
    constructor(private token: string) { }
    public async getAccessToken(): Promise<string> {
        return this.token
    }
}

async function applyFilterToMicrosoftClient(request: EmailFilterRequest) {
    const clientOptions: ClientOptions = {
        authProvider: new ShiftStateMSAuthProvider(request.accessToken)
    }
    const client = Client.initWithMiddleware(clientOptions)
    const filter = await client.api('/me/mailFolders/inbox/messageRules').post({
        displayName: request.description,
        sequence: 1,
        isEnabled: true,
        conditions: {
            senderContains: [
                request.filterConfiguration.from
            ],
            subjectContains: [
                request.filterConfiguration.subject || '',
                ...Object.values(request.filterConfiguration.clauses as Record<string, { value: string }>).map(c => c.value)
            ]
        },
        actions: {
            forwardTo: [
                {
                    emailAddress: {
                        name: "ShiftState",
                        address: "warrendev3190@gmail.com",
                    }
                }
            ],
            stopProcessingRules: true
        }
    })
    console.log('New filter created', filter)
    return filter
}

async function applyFilterToGmailClient(request: EmailFilterRequest) {
    console.log('CREATING FILTER')
    console.log(request)
    const gmail = google.gmail({ version: "v1" })
    const filter = await gmail.users.settings.filters.create({
        oauth_token: request.emailClient.accessToken,
        userId: 'me',
        requestBody: {
            criteria: {
                to: request.filterConfiguration.to as string,
                from: request.filterConfiguration.from as string,
                subject: (request.filterConfiguration.subject || '' as string) + Object.values(request.filterConfiguration.clauses as Record<string, FilterClause>).reduce<string>((acc, clause) => {
                    return acc + ` ${clause.type} ${clause.value}`
                }, '')
            },
            action: {
                forward: request.filterConfiguration.foward as string,
                addLabelIds: ["TRASH"],
            },
        }
    })
    console.log('New filter created', filter)
    return filter
}

async function handleApplyFilterRequest(request: EmailFilterRequest) {
    console.log('APPLYING CREATE FILTER REQUEST')
    switch (request.provider) {
        case 'gmail':
            return await applyFilterToGmailClient(request)
        case 'office365':
            return await applyFilterToMicrosoftClient(request)
    }
}

export async function execute(request: EmailFilterRequest) {
    console.log('FILTER REQUEST')
    console.log(request)
    switch (request.type) {
        case FilterRequest.APPLY_FILTER_REQUEST:
            return await handleApplyFilterRequest(request)
    }
}