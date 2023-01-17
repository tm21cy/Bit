import * as dotenv from "dotenv";
import pino from "pino";
import boot from "./boot";
const log = pino({
  level: process.env.NODE_ENV == "development" ? "debug" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
});
dotenv.config();

export { log };
