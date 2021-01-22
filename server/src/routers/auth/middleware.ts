import { NextFunction, Request, Response } from "express";
import { CREATE_USER } from "./schema";
import { http } from "../../core";
export async function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await CREATE_USER.validate(req.body);
    next();
  } catch (validationError) {
    http.handleResponse(
      res,
      http.StatusCode.BAD_REQUEST,
      null,
      undefined,
      validationError
    );
  }
}
