"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../services/logger");
module.exports = {
    name: "debug",
    once: false,
    execute(info) {
        logger_1.log.debug(info);
        // boot.environment() === "production" ? null : 
    }
};
