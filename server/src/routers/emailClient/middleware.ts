import { Request, Response, NextFunction } from "express";
import { Maybe } from "true-myth";
import { CREATE_EMAIL_CLIENT } from "./schema";
import { http } from "../../core";
import { EmailClientType } from "../../entities/EmailClientType";
export const validateCreateEmailClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate incoming request
    const request = await CREATE_EMAIL_CLIENT.validate(req.body);
    // Ensure is known emailClientType
    const clientType = await EmailClientType.findOne({
      id: request.emailClientTypeId,
    });
    Maybe.fromNullable(clientType).match({
      Just: () => next(),
      Nothing: () => {
        http.handleResponse(
          res,
          http.StatusCode.BAD_REQUEST,
          null,
          "Unknown EmailClientType Specified"
        );
      },
    });
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
