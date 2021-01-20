import jwt from "jsonwebtoken";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import config from "../../core/configuration";

const CONFIG = config().getConfig();

export async function handlePOSTSignUp(req: Request, res: Response) {
  res.status(201).json({
    message: "Signup successful",
    account: req.user,
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
        return res.json(info.message);
      }
      req.login(account, { session: false }, async (error) => {
        if (error) {
          console.log("Error(2):", error);
          return next(error);
        }
        const body = {
          id: account.id,
          emailAddress: account.emailAddress,
        };
        const token = jwt.sign({ account: body }, CONFIG.APP_SECRET);
        return res.json({ token });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
}
