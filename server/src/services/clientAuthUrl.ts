import * as Yup from "yup";
import { Maybe } from "true-myth";
import { google } from "googleapis";

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
export const getAuthUrl = (
  clientType: ClientType,
  clientId: string,
  clientSecret: string,
  redirectUrl: string,
  state: Record<string, unknown> = {}
): string => {
  switch (clientType) {
    case ClientType.OFFICE:
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
    case ClientType.GMAIL:
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
      // ! Happy path coding, may have to address later
      auth.getToken(code, (error, token) => {
        if (error) console.log("Get Token Error", error);
        callback(Maybe.fromNullable(token));
      });
  }
};
