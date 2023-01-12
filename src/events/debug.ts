import boot from "../services/boot";
import { log } from "../services/logger";

module.exports = {
  name: "debug",
  once: false,
  execute(info: string) {
    log.debug(info);
    // boot.environment() === "production" ? null :
  },
};
