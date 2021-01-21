import fetch from "isomorphic-fetch";
import { Maybe } from "true-myth";
import * as authSchema from "./schema";
import { AccountCredentials } from "./types";
import { schema as apiSchema } from "../api";

/* -------------------------------- Constants ------------------------------- */
const POST_FETCH_PARAMS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

/* --------------------------------- Service -------------------------------- */

/**
 *
 */
export class AuthService {
  /**
   *
   * @param credentials
   */
  static async signIn(credentials: AccountCredentials): Promise<Maybe<string>> {
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
          return Maybe.just(token);
        } catch {
          return Maybe.nothing();
        }
      case 401:
        const { message } = await apiSchema.messageResponse.validate(data);
        return Maybe.nothing();
      default:
        return Maybe.nothing();
    }
  }
  /**
   *
   * @param credentials
   */
  static async signUp(credentials: AccountCredentials): Promise<Maybe<string>> {
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
  }
}

export default AuthService;
