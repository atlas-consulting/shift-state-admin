import { Maybe } from "true-myth";

interface ReceiveTokenAction {
  type: "RECEIVE_TOKEN";
  token: string;
}
interface RevokeTokenAction {
  type: "REVOKE_TOKEN";
}

export type AuthAction = ReceiveTokenAction | RevokeTokenAction;

export interface AuthState {
  token: Maybe<string>;
}

const initialState: AuthState = {
  token: Maybe.nothing(),
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthAction
) {
  switch (action.type) {
    case "RECEIVE_TOKEN":
      return { ...state, token: Maybe.just(action.token) };
    case "REVOKE_TOKEN":
      return { ...state, token: Maybe.nothing() };
    default:
      return state;
  }
}

export function receiveToken(token: string): ReceiveTokenAction {
  return {
    token,
    type: "RECEIVE_TOKEN",
  };
}

export function revokeToken(): RevokeTokenAction {
  return {
    type: "REVOKE_TOKEN",
  };
}
