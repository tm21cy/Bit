import boot from "../services/boot";
import { log } from "../services/logger";

module.exports = {
  name: "debug",
  once: false,
  execute(info: string) {
    boot.environment() === "production" ? null : log.debug(info);
  },
};
