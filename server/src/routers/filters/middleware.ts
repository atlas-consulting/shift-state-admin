import { Request, Response, NextFunction } from "express";
import { REQUEST_ALL_FILTERS_FOR_ACCOUNT, CREATE_NEW_FILTER } from "./schema";
import { http } from "../../core";

export const validateCreateFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CREATE_NEW_FILTER.validate(req.body);
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

export const validateRequestFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await REQUEST_ALL_FILTERS_FOR_ACCOUNT.validate(req.params);
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
