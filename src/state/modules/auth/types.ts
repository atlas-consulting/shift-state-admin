export interface AccountCredentials {
  emailAddress: string;
  password: string;
}

export enum AuthActionTypes {
  RECEIVE_TOKEN = "RECEIVE_TOKEN",
  REVOKE_TOKEN = "REVOKE_TOKEN",
}
export interface ReceiveTokenAction {
  type: AuthActionTypes.RECEIVE_TOKEN;
  token: string;
}
export interface RevokeTokenAction {
  type: AuthActionTypes.REVOKE_TOKEN;
}

export type AuthServiceResponses =
  | {
      type: "SIGN_IN_SUCCESSFUL";
      token: string;
    }
  | {
      type: "SIGN_IN_FAILED";
      message: string;
    }
  | {
      type: "SIGN_UP_FAILED";
      message: string;
    }
  | {
      type: "SIGN_UP_SUCCESS";
      message: string;
    };

export type AuthAction = ReceiveTokenAction | RevokeTokenAction;

export interface AuthState {
  token?: string;
}
