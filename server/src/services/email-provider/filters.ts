/**
 * @module EmailProvider.filters
 */
import "isomorphic-fetch";
import { google } from "googleapis";
import * as msal from "@azure/msal-node";
import {
  Client,
  AuthenticationProvider,
  ClientOptions,
} from "@microsoft/microsoft-graph-client";
import { EmailFilterRequest, FilterRequest } from "./types";

export interface FilterClause {
  type: "AND" | "OR";
  id: number;
  value: string;
}

interface MSUser {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

class ShiftStateMSAuthProvider implements AuthenticationProvider {
  constructor(private token: string) {}
  public async getAccessToken(): Promise<string> {
    return this.token;
  }
}

async function applyFilterToMicrosoftClient(request: EmailFilterRequest) {
  const confClient = new msal.ConfidentialClientApplication({
    auth: {
      clientId: request.emailClient.clientId,
      authority: request.emailClient.domain,
      clientSecret: request.emailClient.clientSecret,
    },
  });
  const result = await confClient.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });
  const clientOptions: ClientOptions = {
    authProvider: new ShiftStateMSAuthProvider(result!.accessToken),
  };
  const client = Client.initWithMiddleware(clientOptions);
  let { value }: { value: MSUser[] } = await client.api("/users").get();
  return await Promise.all(
    value.map(async (user) => {
      const filter = await client
        .api(`/users/${user.id}/mailFolders/inbox/messageRules`)
        .post({
          displayName: request.description,
          sequence: 1,
          isEnabled: true,
          conditions: {
            senderContains: [request.filterConfiguration.from],
            subjectContains: [
              request.filterConfiguration.subject || "",
              ...Object.values(
                request.filterConfiguration.clauses as Record<
                  string,
                  { value: string }
                >
              ).map((c) => c.value),
            ],
          },
          actions: {
            forwardTo: [
              {
                emailAddress: {
                  name: "ShiftState",
                  //   Change this to a ShiftState Email
                  address: "warrendev3190@gmail.com",
                },
              },
            ],
            stopProcessingRules: true,
          },
        });
      console.log("New filter created", filter);
      console.log("For user", user.id);
      return filter;
    })
  );
}

async function applyFilterToGmailClient(request: EmailFilterRequest) {
  const auth = new google.auth.JWT(
    request.emailClient.clientEmail,
    undefined,
    JSON.parse(request.emailClient.clientSecret),
    [
      "https://www.googleapis.com/auth/admin.directory.customer",
      "https://www.googleapis.com/auth/admin.directory.domain",
      "https://www.googleapis.com/auth/admin.directory.user",
      "https://www.googleapis.com/auth/gmail.settings.basic",
    ],
    request.emailClient.domain
  );
  console.log("CREATING FILTER");
  console.log(request);
  const admin = google.admin("directory_v1");
  const response = await admin.users.list({
    auth,
    customer: request.emailClient.customerId,
  });
  const gmail = google.gmail({ version: "v1" });
  await Promise.all(
    response.data.users!.map(async (u) => {
      const filter = await gmail.users.settings.filters.create({
        auth,
        userId: u.id,
        requestBody: {
          criteria: {
            to: request.filterConfiguration.to as string,
            from: request.filterConfiguration.from as string,
            subject:
              (request.filterConfiguration.subject || ("" as string)) +
              Object.values(
                request.filterConfiguration.clauses as Record<
                  string,
                  FilterClause
                >
              ).reduce<string>((acc, clause) => {
                return acc + ` ${clause.type} ${clause.value}`;
              }, ""),
          },
          action: {
            forward: request.filterConfiguration.foward as string,
            addLabelIds: ["TRASH"],
          },
        },
      });
      console.log("New filter created", filter);
      return filter;
    })
  );
}

async function handleApplyFilterRequest(request: EmailFilterRequest) {
  console.log("APPLYING CREATE FILTER REQUEST");
  switch (request.provider) {
    case "gmail":
      return await applyFilterToGmailClient(request);
    case "office365":
      return await applyFilterToMicrosoftClient(request);
  }
}

export async function execute(request: EmailFilterRequest) {
  console.log("FILTER REQUEST");
  console.log(request);
  switch (request.type) {
    case FilterRequest.APPLY_FILTER_REQUEST:
      return await handleApplyFilterRequest(request);
  }
}
