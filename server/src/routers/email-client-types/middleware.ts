import { NextFunction, Response, Request } from "express";
import { CREATE_EMAIL_CLIENT_TYPE } from "./schema";
import { http } from "../../core";

export const validateCreateEmailClientType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CREATE_EMAIL_CLIENT_TYPE.validate(req.body);
    next();
  } catch (validationError) {
    http.handleResponse(
      res,
      http.StatusCode.BAD_REQUEST,
      null,
      "Failed to create EmailClientType",
      validationError
    );
  }
};
