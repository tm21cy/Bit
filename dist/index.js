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
exports.client = void 0;
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv = __importStar(require("dotenv"));
const boot_1 = __importDefault(require("./services/boot"));
dotenv.config();
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages
    ],
});
boot_1.default.init();
/* Command Handling */
exports.client.commands = new discord_js_1.Collection();
const commandsPath = node_path_1.default.join(__dirname, "commands");
// eslint-disable-next-line security/detect-non-literal-fs-filename
const commandFiles = node_fs_1.default
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = node_path_1.default.join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
    const command = require(filePath);
    exports.client.commands.set(command.data?.name, command);
}
/* Event Handling */
const eventsPath = node_path_1.default.join(__dirname, "events");
// eslint-disable-next-line security/detect-non-literal-fs-filename
const eventFiles = node_fs_1.default
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const filePath = node_path_1.default.join(eventsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
    const event = require(filePath);
    if (event.once) {
        exports.client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        exports.client.on(event.name, (...args) => event.execute(...args));
    }
}
exports.client.login(process.env.DISCORD_TOKEN);
