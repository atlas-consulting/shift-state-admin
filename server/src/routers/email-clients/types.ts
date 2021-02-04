

export enum EmailClientRoutes {
  EMAIL_CLIENT = "/api/email-clients/:emailClientId",
  EMAIL_CLIENTS = "/api/email-clients",
  EMAIL_CLIENT_FILTERS = "/api/email-clients/:emailClientId/filters",
  EMAIL_CLIENT_CREDENTIALS = "/api/email-clients/credentials",
}

export interface IEmailClientState {
  clientType: string;
  emailClientId: number;
}
