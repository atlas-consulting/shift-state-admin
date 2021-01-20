const path = require("path");
const { config } = require("dotenv");

config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  entities: ["src/entities/*.ts"],
  synchronize: process.env.NODE_ENV === "production" ? false : true,
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
