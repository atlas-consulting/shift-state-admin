import jwt from "jsonwebtoken";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { infoMessageToResponse } from "./strategies";
import { Strategy } from "./types";
import { IConfig, http } from "../../core";

export function onSignUp(config: IConfig) {
  return (req: Request, res: Response) => {
    config.LOGGER.info("Sign-Up Successful");
    http.handleResponse(
      res,
      http.StatusCode.CREATED,
      null,
      "Sign-Up Successful"
    );
  };
}

export function onSignIn(config: IConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    config.LOGGER.info("Sign-In attempt");
    return passport.authenticate(
      Strategy.SIGN_IN,
      async (err, account, info) => {
        try {
          if (err || !account) {
            config.LOGGER.info("Sign-In Failed.");
            config.LOGGER.info("Unauthorized or non-existent credentials");
            return http.handleResponse(
              res,
              http.StatusCode.UNAUTHORIZED,
              null,
              infoMessageToResponse(info.message)
            );
          }
          req.login(account, { session: false }, async (error) => {
            if (error) {
              config.LOGGER.error("Unexpected error in sign-in");
              config.LOGGER.error(error);
              return next(error);
            }
            config.LOGGER.info("Sign-In successful!");
            const body = {
              id: account.id,
              emailAddress: account.emailAddress,
            };
            const token = jwt.sign({ account: body }, config.APP_SECRET);
            return http.handleResponse(
              res,
              http.StatusCode.OK,
              token,
              "Sign-In Successful"
            );
          });
        } catch (err) {
          config.LOGGER.error("Unexpected error in sign-in");
          config.LOGGER.error(err);
          return next(err);
        }
      }
    )(req, res, next);
  };
}
