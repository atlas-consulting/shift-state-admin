import { AuthAction, AuthState } from "./types";

const initialState: AuthState = {
  token: undefined,
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthAction
) {
  switch (action.type) {
    case "RECEIVE_TOKEN":
      return { ...state, token: action.token };
    case "REVOKE_TOKEN":
      return { ...state, token: undefined };
    default:
      return state;
  }
}
