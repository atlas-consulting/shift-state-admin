import { NextFunction, Request, Response } from "express";
import { createUserRequest } from "./validators";
export async function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await createUserRequest.validate(req.body);
    next();
  } catch (validationError) {
    res.status(400).json({
      error: validationError,
    });
  }
}
