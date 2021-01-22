import { Application, Router } from "express";
import * as middleware from "./middleware";
import * as controllers from "./controllers";
import * as strategies from "./strategies";
import { IConfig } from "../../core";
import { AuthRoutes } from "./types";
export * as Strategies from "./strategies";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting Authentication Router");

  /* --------------------------------- Routes --------------------------------- */
  const authRouter = Router();
  authRouter
    .post(
      AuthRoutes.SIGN_UP,
      middleware.validateSignUp,
      strategies.SIGN_UP,
      controllers.onSignUp(config)
    )
    .post(AuthRoutes.SIGN_IN, controllers.onSignIn(config));
  application.use(authRouter);
};
