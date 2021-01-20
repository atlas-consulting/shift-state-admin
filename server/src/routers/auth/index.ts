import { Application, Router } from "express";
import passport from "passport";
import * as middleware from "../middleware";
import * as handlers from "./handlers";
import * as strategies from "./strategies";

export const mount = (application: Application) => {
  /* -------------------------------- Passport -------------------------------- */

  passport.use("sign-up", strategies.signUp);
  passport.use("sign-in", strategies.signIn);

  /* --------------------------------- Routes --------------------------------- */

  const authRouter = Router();
  authRouter
    .post(
      "/api/sign-up",
      middleware.validateSignUp,
      passport.authenticate("sign-up", { session: false }),
      handlers.handlePOSTSignUp
    )
    .post("/api/sign-in", handlers.handlePOSTSignIn);
  application.use(authRouter);
};
