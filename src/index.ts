import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import * as dotenv from "dotenv";
import boot from "./services/boot";
import { log } from "./services/logger";
import { Sequelize } from "sequelize";
dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const dbUrl =
  process.env.NODE_ENV == "development"
    ? process.env.DATABASE_URL_DEV
    : process.env.DATABASE_URL_PROD;
const dbUser =
  process.env.NODE_ENV == "development"
    ? process.env.DATABASE_USER_DEV
    : process.env.DATABASE_USER_PROD;
const dbPw =
  process.env.NODE_ENV == "development"
    ? process.env.DATABASE_PW_DEV
    : process.env.DATABASE_PW_PROD;

const db = new Sequelize(dbUrl as string, {
  username: dbUser,
  password: dbPw,
  dialect: "mysql",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
    multipleStatements: true,
  },
});

boot.init();

/* Command Handling */

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
// eslint-disable-next-line security/detect-non-literal-fs-filename
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
  const command = require(filePath);
  client.commands.set(command.data?.name, command);
}

/* Event Handling */

const eventsPath = path.join(__dirname, "events");
// eslint-disable-next-line security/detect-non-literal-fs-filename
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/* Text Command Handling */

client.textCommands = new Collection();
const tcpath = path.join(__dirname, "textCommands");
const textCommandFiles = fs
  .readdirSync(tcpath)
  .filter((file) => file.endsWith(".js"));
for (const file of textCommandFiles) {
  const filePath = path.join(tcpath, file);
  const command = require(filePath);
  client.textCommands.set(command.name, command);
}

declare module "discord.js" {
  export interface Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: Collection<unknown, any>;
    textCommands: Collection<unknown, any>;
  }
}

db.authenticate()
  .then(() => log.info("Database connected."))
  .catch((err: Error) => {
    log.fatal(`Database could not authenticate: ${err.message}`);
    process.exit(1);
  });

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => log.info(`Connected as ${client.user?.tag}.`));

export { db };
