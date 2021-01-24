import {
  EmailClientState,
  EmailClientActionTypes,
  EmailClientActions,
} from "./types";

export function reducer(
  state: EmailClientState = { emailClients: {} },
  action: EmailClientActions
): EmailClientState {
  switch (action.type) {
    case EmailClientActionTypes.FETCH_EMAIL_CLIENTS_ERROR:
    case EmailClientActionTypes.FETCH_EMAIL_CLIENTS:
      return state;
    case EmailClientActionTypes.RECEIVE_EMAIL_CLIENTS:
      const emailClients = action.payload.reduce<
        EmailClientState["emailClients"]
      >((acc, emailClient) => {
        return {
          ...acc,
          [emailClient.id]: emailClient,
        };
      }, {});
      return { ...state, emailClients };
    default:
      return state;
  }
}
