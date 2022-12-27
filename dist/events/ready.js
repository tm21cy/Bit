"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = require("colorette");
const boot_1 = __importDefault(require("../services/boot"));
const logger_1 = require("../services/logger");
module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        const environment = boot_1.default.environment();
        logger_1.log.info(`Client ready with ${client.users.cache.size} users across ${client.guilds.cache.size} guilds in ${(0, colorette_1.bgMagentaBright)(environment)} mode.`);
    },
};
