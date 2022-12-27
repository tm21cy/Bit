"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
const colorette_1 = require("colorette");
const dotenv = __importStar(require("dotenv"));
const logger_1 = require("./logger");
const general_1 = __importDefault(require("../utilities/general"));
dotenv.config();
/**
 * Contains core functions of the bot that provide vital functionality.
 * @class
 */
class boot {
    /**
     * Initializes the logger and sentry on the correct environment and checks for any missing environment variables. Connects to the database.
     * @returns {Promise<void>}
     * @error Quits the process on error.
     */
    static async init() {
        const environment = process.env.NODE_ENV;
        if (!environment) {
            logger_1.log.fatal("NODE_ENV environment variable is not set");
            boot.exit(1);
        }
        switch (true) {
            case !process.env.DISCORD_TOKEN:
                logger_1.log.fatal("DISCORD_TOKEN is not set in .env");
                boot.exit(1);
                break;
            case !process.env.CLIENT_ID:
                logger_1.log.fatal("CLIENT_ID is not set in .env");
                boot.exit(1);
                break;
            case general_1.default.decodeBase64(process.env.DISCORD_TOKEN?.split(".")[0]) !== process.env.CLIENT_ID:
                logger_1.log.fatal("Client ID found in DISCORD_TOKEN and CLIENT_ID do not match.");
                boot.exit(1);
                break;
        }
        logger_1.log.info(`Passed boot checks successfully. Starting in ${(0, colorette_1.bgMagentaBright)(boot.environment())} mode.`);
    }
    /**
     * Gives the current environment the bot is running in. If not set, it will return "development".
     * @returns {string} The environment the bot is running in.
     */
    static environment() {
        return process.env.NODE_ENV ?? "development";
    }
    /**
     * Exists the process with the given code. If no code is given, it will exit with code 0.
     * @param {number} [code=0] The exit code.
     * @returns {void}
     */
    static exit(code = 0) {
        logger_1.log.fatal(`Exiting with code ${code ?? 0}. Exit Function Called.`);
        process.exit(code);
    }
}
exports.default = boot;
