import { Application, Router } from "express";
import passport from "passport";
import * as middleware from "./middleware";
import * as controllers from "./controllers";
import * as strategies from "./strategies";
import { IConfig } from "../../core";
import { AuthRoutes } from "./types";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting Authentication Router");
  /* -------------------------------- Passport -------------------------------- */
  passport.use("verify-token", strategies.verifyToken);
  passport.use("sign-up", strategies.signUp);
  passport.use("sign-in", strategies.signIn);

  /* --------------------------------- Routes --------------------------------- */
  const authRouter = Router();
  authRouter
    .post(
      AuthRoutes.SIGN_UP,
      middleware.validateSignUp,
      passport.authenticate("sign-up", { session: false }),
      controllers.onSignUp(config)
    )
    .post(AuthRoutes.SIGN_IN, controllers.onSignIn(config));
  application.use(authRouter);
};
