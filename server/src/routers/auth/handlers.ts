import jwt from "jsonwebtoken";
import passport from "passport";
import { Request, Response, NextFunction } from "express";

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
