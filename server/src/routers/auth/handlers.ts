import jwt from "jsonwebtoken";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import config from "../../core/configuration";
const CONFIG = config().getConfig();

export async function handlePOSTSignUp(req: Request, res: Response) {
  res.status(201).json({
    message: "Signup successful",
  });
}

export function handlePOSTSignIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return passport.authenticate("sign-in", async (err, account, info) => {
    try {
      if (err || !account) {
        return res.status(401).json(info);
      }
      req.login(account, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }
        const body = {
          id: account.id,
          emailAddress: account.emailAddress,
        };
        const token = jwt.sign({ account: body }, CONFIG.APP_SECRET);
        return res.status(200).json({
          message: "Sign In Successful",
          data: {
            token,
          },
          errors: [],
        });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
}
