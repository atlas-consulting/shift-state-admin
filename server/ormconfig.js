const path = require("path");
const { config } = require("dotenv");

config({ path: path.resolve(__dirname, "../.env") });
const entities =
  process.env.NODE_ENV === "production"
    ? [path.resolve(__dirname, "./**/entities/*.js")]
    : [path.resolve(__dirname, "./**/entities/*.ts")];
module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  entities,
  synchronize: true,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
