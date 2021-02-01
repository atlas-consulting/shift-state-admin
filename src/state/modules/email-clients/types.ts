import { ThunkAction } from "redux-thunk";
import { Filter } from "../filters/types";

export enum EmailClientEndpoints {
  EMAIL_CLIENTS = "/api/email-clients",
}

export interface EmailClient {
  id: number;
  alias: string;
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  type: {
    description: string;
  };
  connectedFilters: {
    filter: Filter;
  }[];
}
export interface EmailClientState {
  emailClients: Record<number, EmailClient>;
}

export enum EmailClientActionTypes {
  FETCH_EMAIL_CLIENTS = "FETCH_EMAIL_CLIENTS",
  FETCH_EMAIL_CLIENTS_ERROR = "FETCH_EMAIL_CLIENTS_ERROR",
  RECEIVE_EMAIL_CLIENTS = "RECEIVE_EMAIL_CLIENTS",
}

export interface FetchEmailClientsAction {
  type: EmailClientActionTypes.FETCH_EMAIL_CLIENTS;
}

export interface FetchEmailClientsErrorAction {
  type: EmailClientActionTypes.FETCH_EMAIL_CLIENTS_ERROR;
}

export interface ReceiveEmailClientsAction {
  type: EmailClientActionTypes.RECEIVE_EMAIL_CLIENTS;
  payload: EmailClient[];
}

export type EmailClientActions =
  | FetchEmailClientsAction
  | FetchEmailClientsErrorAction
  | ReceiveEmailClientsAction;

export type EmailClientsThunkResult<R> = ThunkAction<
  R,
  EmailClientState,
  undefined,
  EmailClientActions
>;
