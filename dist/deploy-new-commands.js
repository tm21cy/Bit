"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const logger_1 = require("./services/logger");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const stopwatch_1 = require("@sapphire/stopwatch");
async function deploy() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commands = [];
    const commandsPath = path_1.default.join(__dirname, "commands");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const commandFiles = fs_1.default
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        // eslint-disable-next-line security/detect-non-literal-require, @typescript-eslint/no-var-requires
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
    const commandNames = commands.filter((obj) => obj.name);
    logger_1.log.info(`Found ${commands.length} commands. Registering...`);
    const time = new stopwatch_1.Stopwatch();
    const rest = new rest_1.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
    const curCommands = await rest.get(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID));
    const curCommandsArr = new Array(curCommands);
    console.log(curCommands);
    if (assert(curCommandsArr)) {
        for (let i = 0; i < curCommandsArr.length; i++) {
            if (commandNames.includes(curCommandsArr[i].name)) {
                console.log(curCommandsArr[i].name);
                const idx = commandNames.indexOf(curCommandsArr[i].name);
                if (idx > -1)
                    commands.splice(idx, 1);
            }
        }
    }
    rest
        .put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    })
        .then(() => {
        logger_1.log.info(`Successfully registered ${commands.length} commands in ${time.toString()}`);
    })
        .catch((error) => {
        time.stop();
        logger_1.log.error(error, "Failed to register application commands.");
    });
}
function assert(obj) {
    return (Array.isArray(obj));
}
deploy();
