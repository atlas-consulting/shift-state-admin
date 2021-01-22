import { Response } from "express";

export interface APIResponse {
  statusCode: StatusCode;
  message: string;
  data?: unknown;
  errors: string | string[] | unknown | unknown[];
}

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const statusCodeMessage: Record<StatusCode, string> = {
  200: "Ok",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

const getStatusMessage = (statusCode: StatusCode): string =>
  statusCodeMessage[statusCode];
export const handleResponse = <T>(
  res: Response,
  statusCode: StatusCode = StatusCode.OK,
  payload: T | null = null,
  message?: string,
  ...errors: unknown[]
) => {
  if (message) {
    return res.status(statusCode).json({
      statusCode,
      message,
      data: payload,
      errors: [...errors],
    });
  }
  return res.status(statusCode).json({
    statusCode,
    message: getStatusMessage(statusCode),
    data: payload,
    errors: [...errors],
  });
};
export const generateJSONResponse = <T>(
  statusCode: StatusCode,
  payload: T,
  message?: string
): APIResponse => {
  if (message) {
    return {
      statusCode,
      message,
      data: JSON.stringify(payload),
      errors: [],
    };
  }
  return {
    statusCode,
    message: getStatusMessage(statusCode),
    data: JSON.stringify(payload),
    errors: [],
  };
};

export const ok = () => generateJSONResponse(200, null);
export const created = () => generateJSONResponse(201, null);
export const badRequest = () => generateJSONResponse(400, null);
export const unauthorized = () => generateJSONResponse(401, null);
