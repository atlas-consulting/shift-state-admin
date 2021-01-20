import * as yup from "yup";
import fetch from "isomorphic-fetch";
import { Maybe } from "true-myth";

const signInResponse = yup.object({
  token: yup.string().required(),
});
const signUpResponse = yup.object({
  message: yup.string().required(),
});

export class AuthService {
  static async signIn(credentials: {
    emailAddress: string;
    password: string;
  }): Promise<Maybe<string>> {
    const { emailAddress, password } = credentials;
    const response = await fetch("/api/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress, password }),
    });
    const data = await response.json();
    try {
      const { token } = await signInResponse.validate(data);
      return Maybe.just(token);
    } catch {
      return Maybe.nothing();
    }
  }
  static async signUp(credentials: {
    emailAddress: string;
    password: string;
  }): Promise<Maybe<string>> {
    const { emailAddress, password } = credentials;

    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress, password }),
    });
    if (response.status !== 201)
      throw new Error("Failed to created new Account");
    const data = await response.json();
    try {
      const { message } = await signUpResponse.validate(data);
      return Maybe.just(message);
    } catch {
      return Maybe.nothing();
    }
  }
}

export default AuthService;
