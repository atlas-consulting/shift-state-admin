import { Request, Response, NextFunction } from "express";
import { GET_CLIENT_AUTH_URL } from "./schema";
import { http } from "../../core";

export const validateGetClientAuthUrl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    GET_CLIENT_AUTH_URL.validate(req.params);
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
};
