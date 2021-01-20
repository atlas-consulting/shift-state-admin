import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
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
        return done(null, false, { message: "Account not found" });
      }
      const isValidPassword = await account.isValidPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: "Invalid Credentials" });
      }
      return done(null, account, { message: "Logged in Sucessfully" });
    } catch (error) {
      return done(error);
    }
  }
);
