/**
 * @module core.application
 */
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const BUILD_DIR = path.resolve(__dirname, "../../../build");
const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
app.use(express.static(BUILD_DIR));

app.get("/api/health-check", (req, res) => {
  res.sendStatus(200);
});
app.get("/api/ping", (req, res) => {
  res.json("pong");
});
app.use("*", (req, res) => {
  res.sendFile(path.join(BUILD_DIR, "index.html"));
});

export default app;
