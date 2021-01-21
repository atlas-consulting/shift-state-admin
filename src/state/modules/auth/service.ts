import fetch from "isomorphic-fetch";
import { Maybe } from "true-myth";
import * as authSchema from "./schema";
import {
  AccountCredentials,
  AuthServiceResponse,
  AuthServiceResponseTypes,
} from "./types";
import { schema as apiSchema } from "../api";

/* -------------------------------- Constants ------------------------------- */
const POST_FETCH_PARAMS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

type Fetch = typeof fetch;

/* --------------------------------- Service -------------------------------- */

export const createAuthService = (fetch: Fetch) => {
  return {
    /**
     *
     * @param credentials
     */
    async signIn(
      credentials: AccountCredentials
    ): Promise<AuthServiceResponse> {
      const { emailAddress, password } = credentials;
      const response = await fetch("/api/sign-in", {
        ...POST_FETCH_PARAMS,
        body: JSON.stringify({ emailAddress, password }),
      });
      const data = await response.json();
      switch (response.status) {
        case 200:
          try {
            const {
              data: { token },
            } = await authSchema.signInResponse.validate(data);
            return {
              type: AuthServiceResponseTypes.SIGN_IN_SUCCESSFUL,
              token,
            };
          } catch {
            return {
              type: AuthServiceResponseTypes.UNEXPECTED_ERROR,
              message: "Something Unexpected Happend",
            };
          }
        case 401:
          const { message } = await apiSchema.messageResponse.validate(data);
          return {
            type: AuthServiceResponseTypes.SIGN_IN_FAILED,
            message,
          };
        default:
          return {
            type: AuthServiceResponseTypes.UNEXPECTED_ERROR,
            message: "Something Unexpected Happend",
          };
      }
    },
    /**
     *
     * @param credentials
     */
    async signUp(credentials: AccountCredentials): Promise<Maybe<string>> {
      const { emailAddress, password } = credentials;

      const response = await fetch("/api/sign-up", {
        ...POST_FETCH_PARAMS,
        body: JSON.stringify({ emailAddress, password }),
      });
      if (response.status !== 201)
        throw new Error("Failed to created new Account");
      const data = await response.json();
      try {
        const { message } = await apiSchema.messageResponse.validate(data);
        return Maybe.just(message);
      } catch {
        return Maybe.nothing();
      }
    },
  };
};
