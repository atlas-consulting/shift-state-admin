import passport, { AuthenticateOptions } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy } from "./types";
import config from "../../core/configuration";
import { Account } from "../../entities/Account";

const CONFIG = config().getConfig();
const ACCOUNT_FIELDS_MAP = {
  usernameField: "emailAddress",
  passwordField: "password",
};
export const verifyToken = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CONFIG.APP_SECRET,
  },
  async (jwt, verfify) => {
    try {
      const account = await Account.find(jwt.id);
      verfify(null, account);
    } catch (error) {
      verfify(error);
    }
  }
);
export const signUp = new LocalStrategy(
  ACCOUNT_FIELDS_MAP,
  async (emailAddress, password, done) => {
    try {
      const account = await Account.new({ emailAddress, password });
      return done(null, account);
    } catch (error) {
      done(error);
    }
  }
);
export const signIn = new LocalStrategy(
  ACCOUNT_FIELDS_MAP,
  async (emailAddress, password, done) => {
    try {
      const account = await Account.findOne({ where: { emailAddress } });
      if (!account) {
        return done(null, false, {
          message: "ACCOUNT_NOT_FOUND",
        });
      }
      const isValidPassword = await account.isValidPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: "INVALID_CREDENTIALS" });
      }
      return done(null, account, { message: "SUCCESS" });
    } catch (error) {
      return done(error);
    }
  }
);

export const infoMessageToResponse = (
  message: "SUCCESS" | "INVALID_CREDENTIALS" | "ACCOUNT_NOT_FOUND"
): string => {
  switch (message) {
    case "SUCCESS":
      return "Sign-In Successful";
    case "ACCOUNT_NOT_FOUND":
    case "INVALID_CREDENTIALS":
      return "Unauthorized";
  }
};

const AUTH_OPTIONS: AuthenticateOptions = { session: false };

/* ----------------------------- Bind Strategies ---------------------------- */
passport.use(Strategy.VERIFY_TOKEN, verifyToken);
passport.use(Strategy.SIGN_UP, signUp);
passport.use(Strategy.SIGN_IN, signIn);

/* --------------------------- Exported Strategies -------------------------- */

export const SIGN_UP = passport.authenticate(Strategy.SIGN_UP, AUTH_OPTIONS);
export const SIGN_IN = passport.authenticate(Strategy.SIGN_IN, AUTH_OPTIONS);
export const VERIFY_TOKEN = passport.authenticate(
  Strategy.VERIFY_TOKEN,
  AUTH_OPTIONS
);
