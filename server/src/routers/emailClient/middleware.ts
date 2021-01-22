import { Request, Response, NextFunction } from "express";
import { Maybe } from "true-myth";
import {
  CREATE_EMAIL_CLIENT,
  APPLY_FILTER_TO_CLIENT,
  EMAIL_CLIENT_FILTERS,
} from "./schema";
import { http } from "../../core";
import { EmailClientType } from "../../entities/EmailClientType";

export const validateEmailClientFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await EMAIL_CLIENT_FILTERS.validate(req.params);
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

export const validateApplyFilterToEmailClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await APPLY_FILTER_TO_CLIENT.validate({
      ...req.params,
      ...req.body,
    });
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
