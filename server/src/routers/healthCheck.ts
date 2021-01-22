import { Application, Router } from "express";
import { http } from "../core";
const healthCheckRouter = Router();

healthCheckRouter
  .get("/api/health-check", (req, res) => {
    http.handleResponse(res, http.StatusCode.OK);
  })
  .get("/api/ping", (req, res) => {
    http.handleResponse(res, http.StatusCode.OK, "pong");
  });

export const mount = (application: Application) => {
  application.use(healthCheckRouter);
};
