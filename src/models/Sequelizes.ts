import { Sequelize } from "sequelize";
import { log } from "../services/logger";
import path from "node:path";
import SQLite from "sqlite3";
import boot from "../services/boot";

const environment = boot.environment();
const dbUrl =
  environment == "development"
    ? process.env.DATABASE_URL_DEV
    : process.env.DATABASE_URL_PROD;
const dbUser =
  environment == "development"
    ? process.env.DATABASE_USER_DEV
    : process.env.DATABASE_USER_PROD;
const dbPw =
  environment == "development"
    ? process.env.DATABASE_PW_DEV
    : process.env.DATABASE_PW_PROD;

const db = new Sequelize(dbUrl as string, {
  username: dbUser,
  password: dbPw,
  dialect: "mysql",
  ssl: true,
  logging: log.info.bind(log),
  dialectOptions: {
    ssl: {
      require: true,
    },
    multipleStatements: true,
  },
});

export { db };
