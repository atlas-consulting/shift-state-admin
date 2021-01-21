import {
  ReceiveTokenAction,
  RevokeTokenAction,
  AuthActionTypes,
} from "./types";

export function receiveToken(token: string): ReceiveTokenAction {
  return {
    token,
    type: AuthActionTypes.RECEIVE_TOKEN,
  };
}

export function revokeToken(): RevokeTokenAction {
  return {
    type: AuthActionTypes.REVOKE_TOKEN,
  };
}
