export interface AccountCredentials {
  emailAddress: string;
  password: string;
}

export enum AuthActionTypes {
  RECEIVE_TOKEN = "RECEIVE_TOKEN",
  REVOKE_TOKEN = "REVOKE_TOKEN",
}

export enum AuthServiceResponseTypes {
  SIGN_IN_SUCCESSFUL = "SIGN_IN_SUCCESSFUL",
  SIGN_IN_FAILED = "SIGN_IN_FAILED",
  SIGN_UP_FAILED = "SIGN_UP_FAILED",
  SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}
export interface ReceiveTokenAction {
  type: AuthActionTypes.RECEIVE_TOKEN;
  token: string;
}
export interface RevokeTokenAction {
  type: AuthActionTypes.REVOKE_TOKEN;
}

export type AuthServiceResponse =
  | {
      type: AuthServiceResponseTypes.SIGN_IN_SUCCESSFUL;
      token: string;
    }
  | {
      type: AuthServiceResponseTypes.SIGN_IN_FAILED;
      message: string;
    }
  | {
      type: AuthServiceResponseTypes.SIGN_UP_FAILED;
      message: string;
    }
  | {
      type: AuthServiceResponseTypes.SIGN_UP_SUCCESS;
      message: string;
    }
  | {
      type: AuthServiceResponseTypes.UNEXPECTED_ERROR;
      message: "Something Unexpected Happend";
    };

export type AuthAction = ReceiveTokenAction | RevokeTokenAction;

export interface AuthState {
  token?: string;
}
