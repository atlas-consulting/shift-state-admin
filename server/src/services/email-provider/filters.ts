/**
 * @module EmailProvider.filters
 */

import { google } from 'googleapis'
import { EmailFilterRequest, FilterRequest } from "./types";

async function applyFilterToGmailClient(request: EmailFilterRequest) {
    console.log('CREATING FILTER')
    console.log(request)
    const gmail = google.gmail({ version: "v1" })
    await gmail.users.settings.filters.create({
        oauth_token: request.emailClient.accessToken,
        userId: 'me',
        requestBody: {
            criteria: {
                to: request.filterConfiguration.to as string,
                from: request.filterConfiguration.from as string,
                subject: request.filterConfiguration.subject as string
            },
            action: {
                forward: request.filterConfiguration.foward as string,
                addLabelIds: ["TRASH"],
            },

        }
    })
    return
}

async function handleApplyFilterRequest(request: EmailFilterRequest) {
    console.log('APPLYING CREATE FILTER REQUEST')
    switch (request.provider) {
        case 'gmail':
            return await applyFilterToGmailClient(request)
        case 'office365':
            console.info('No Op')
            return
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