export enum ClientAuthUrlRoutes {
  CLIENT_AUTH_URL = "/api/client-auth-urls/:clientType/:emailClientId",
}
export interface IGmailClientToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}
