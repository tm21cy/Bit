import { Client, Collection, GatewayIntentBits } from "discord.js"
import fs from "node:fs"
import path from "node:path"
import * as dotenv from "dotenv"
import boot from "./services/boot"
dotenv.config()

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages
	],
})

boot.init()

/* Command Handling */

client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
// eslint-disable-next-line security/detect-non-literal-fs-filename
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	// eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
	const command = require(filePath)
	client.commands.set(command.data?.name, command)
}

/* Event Handling */

const eventsPath = path.join(__dirname, "events")
// eslint-disable-next-line security/detect-non-literal-fs-filename
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	// eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
	const event = require(filePath)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

declare module "discord.js" {
	export interface Client {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		commands: Collection<unknown, any>
	}
}

client.login(process.env.DISCORD_TOKEN)
