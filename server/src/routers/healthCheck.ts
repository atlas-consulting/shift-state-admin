import { Application, Router } from "express";

const healthCheckRouter = Router();

healthCheckRouter
  .get("/api/health-check", (req, res) => {
    res.sendStatus(200);
  })
  .get("/api/ping", (req, res) => {
    res.json("pong");
  });

export const mount = (application: Application) => {
  application.use(healthCheckRouter);
};
