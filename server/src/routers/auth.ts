import { Application, Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import * as middleware from "./middleware";
import { Account } from "../entities/Account";

passport.use(
  "sign-up",
  new LocalStrategy(
    {
      usernameField: "emailAddress",
      passwordField: "password",
    },
    async (emailAddress, password, done) => {
      try {
        const account = await Account.new({ emailAddress, password });
        return done(null, account);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "sign-in",
  new LocalStrategy(
    {
      usernameField: "emailAddress",
      passwordField: "password",
    },
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
  )
);

function handlePOSTSignIn(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate("sign-in", async (error, account, info) => {
    try {
      if (error || !account) return next(error);
      req.login(account, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: account.id,
          emailAddress: account.emailAddress,
        };
        const token = jwt.sign({ account: body }, "TOP_SECRET");
        res.json({ token });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
}

export const mount = (application: Application) => {
  const authRouter = Router();
  authRouter
    .post(
      "/api/sign-up",
      middleware.validateSignUp,
      passport.authenticate("sign-up", { session: false }),
      async (req, res) => {
        res.status(201).json({
          message: "Signup successful",
          account: req.user,
        });
      }
    )
    .post("/api/sign-in", handlePOSTSignIn);
  application.use(authRouter);
};
