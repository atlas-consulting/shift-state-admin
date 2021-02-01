import * as Yup from "yup";
import { Maybe } from "true-myth";
import { google } from "googleapis";
import * as msal from "@azure/msal-node";
import { Filter } from "../entities/Filter";
import { EmailClient } from "../entities/EmailClient";

const GMAIL = Yup.string().matches(new RegExp("[G|g]mail"));
const OFFICE = Yup.string().matches(new RegExp("[O|o]ffice365"));

export enum ClientType {
  GMAIL = "gmail",
  OFFICE = "office365",
}

export const parseClientType = (type: string): ClientType => {
  const [match] = [GMAIL, OFFICE].filter((schema) => schema.isValidSync(type));
  return match.validateSync(type) as ClientType;
};

/**
 *
 * @param clientType
 * @param clientId
 * @param clientSecret
 * @param redirectUrl
 */
export const getAuthUrl = async (
  clientType: ClientType,
  clientId: string,
  clientSecret: string,
  redirectUrl: string,
  state: Record<string, unknown> = {}
): Promise<string> => {
  switch (clientType) {
    case ClientType.OFFICE:
      const msalConfig: msal.Configuration = {
        auth: {
          clientId,
          clientSecret,
        },
      };
      const msalClient = new msal.ConfidentialClientApplication(msalConfig);
      return await msalClient.getAuthCodeUrl({
        scopes: [],
        redirectUri: redirectUrl,
        state: JSON.stringify(state),
      });
    case ClientType.GMAIL:
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
      return auth.generateAuthUrl({
        access_type: "offline",
        state: JSON.stringify(state),
        scope: [
          "https://www.googleapis.com/auth/gmail.labels",
          "https://www.googleapis.com/auth/gmail.settings.basic",
        ],
      });
  }
};

interface AuthCredentials {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}
export const applyFilter = async (
  { filterConfiguration }: Filter,
  emailClient: EmailClient,
  emailClientTypeDesc: string
) => {
  console.log(emailClient, emailClientTypeDesc);
  switch (emailClientTypeDesc) {
    case "GMAIL":
      const gmail = google.gmail({ version: "v1" });
      const filter = await gmail.users.settings.filters.create({
        oauth_token: emailClient.accessToken,
        userId: "me",
        requestBody: {
          criteria: {
            to: filterConfiguration.to as string,
            from: filterConfiguration.from as string,
            subject: filterConfiguration.subject as string,
          },
          action: {
            forward: filterConfiguration.foward as string,
            addLabelIds: ["TRASH"],
          },
        },
      });
      console.log(filter);
      break;
    default:
      console.log("NoOp");
      return;
  }
};

/**
 *
 * @param clientType
 * @param clientId
 * @param clientSecret
 * @param redirectUrl
 */
export const getClientToken = (
  clientType: ClientType,
  clientId: string,
  clientSecret: string,
  redirectUrl: string,
  code: string,
  callback: <T>(token: Maybe<T>) => void
): void => {
  switch (clientType) {
    case ClientType.OFFICE:
      const msalConfig: msal.Configuration = {
        auth: {
          clientId,
          clientSecret,
        },
      };
      const msalClient = new msal.ConfidentialClientApplication(msalConfig);
      msalClient
        .acquireTokenByCode({
          code,
          scopes: [],
          redirectUri: redirectUrl,
        })
        .then((res) => {
          callback(Maybe.fromNullable(res));
        });
      break;
    case ClientType.GMAIL:
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
      // ! Happy path coding, may have to address later
      auth.getToken(code, (error, token) => {
        if (error) console.log("Get Token Error", error);
        callback(Maybe.fromNullable(token));
      });
  }
};
