import fetch from "isomorphic-fetch";
import {
  EmailClientsThunkResult,
  EmailClientEndpoints,
  FetchEmailClientsAction,
  ReceiveEmailClientsAction,
  EmailClientActionTypes,
  EmailClient,
} from "./types";
import { FETCH_EMAIL_CLIENTS_SUCCESS_RESPONSE } from "./schema";
const fetchEmailClientsAction = (): FetchEmailClientsAction => ({
  type: EmailClientActionTypes.FETCH_EMAIL_CLIENTS,
});

const receiveEmailClientsAction = (
  emailClients: EmailClient[]
): ReceiveEmailClientsAction => ({
  type: EmailClientActionTypes.RECEIVE_EMAIL_CLIENTS,
  payload: emailClients,
});

export function fetchEmailClients(
  token: string
): EmailClientsThunkResult<void> {
  return async (dispatch) => {
    dispatch(fetchEmailClientsAction());
    const response = await fetch(EmailClientEndpoints.EMAIL_CLIENTS, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    switch (response.status) {
      case 500:
      case 400:
      case 200:
        const data = await response.json();

        const {
          data: emailClients,
        } = await FETCH_EMAIL_CLIENTS_SUCCESS_RESPONSE.validate(data);
        dispatch(receiveEmailClientsAction(emailClients));
    }
  };
}
