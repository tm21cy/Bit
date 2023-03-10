import bodyParser from "body-parser"
// rome-ignore lint/correctness/noUnusedVariables: internal rome bug
import { Client, Collection, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import express from "express"
import fs from "node:fs"
import path from "node:path"
import status from "./express/routes/status.routes"
import { db } from "./models/Sequelizes"
import boot from "./services/boot"
import { log } from "./services/logger"
dotenv.config()

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent
	]
})

let app = express()

const environment = boot.environment()
const _dbUrl =
	environment === "development"
		? process.env.DATABASE_URL_DEV
		: process.env.DATABASE_URL_PROD
const _dbUser =
	environment === "development"
		? process.env.DATABASE_USER_DEV
		: process.env.DATABASE_USER_PROD
const _dbPw =
	environment === "development"
		? process.env.DATABASE_PW_DEV
		: process.env.DATABASE_PW_PROD

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

/* Text Command Handling */

client.textCommands = new Collection()
const tcpath = path.join(__dirname, "textCommands")
const textCommandFiles = fs
	.readdirSync(tcpath)
	.filter((file) => file.endsWith(".js"))
for (const file of textCommandFiles) {
	const filePath = path.join(tcpath, file)
	const command = require(filePath)
	client.textCommands.set(command.name, command)
}

/* Button Handling */

client.buttons = new Collection()
const buttonPath = path.join(__dirname, "buttons")
const buttonFiles = fs
	.readdirSync(buttonPath)
	.filter((file) => file.endsWith(".js"))
for (const file of buttonFiles) {
	const filePath = path.join(buttonPath, file)
	const button = require(filePath)
	client.buttons.set(button.name, button)
}
/* Menu Handling */

client.menus = new Collection()
const menuPath = path.join(__dirname, "menus")
const menuFiles = fs
	.readdirSync(menuPath)
	.filter((file) => file.endsWith(".js"))
for (const file of menuFiles) {
	const filePath = path.join(menuPath, file)
	const menu = require(filePath)
	client.menus.set(menu.name, menu)
}

client.modals = new Collection()
const modalPath = path.join(__dirname, "modals")
const modalFiles = fs
	.readdirSync(modalPath)
	.filter((file) => file.endsWith(".js"))
for (const file of modalFiles) {
	const filePath = path.join(modalPath, file)
	const modal = require(filePath)
	client.modals.set(modal.name, modal)
}

declare module "discord.js" {
	export interface Client {
		// rome-ignore lint/suspicious/noExplicitAny: commands do not have a enforced type yet
		commands: Collection<string, any>
		// rome-ignore lint/suspicious/noExplicitAny: text commands do not have a enforced type yet
		textCommands: Collection<string, any>
		// rome-ignore lint/suspicious/noExplicitAny: buttons do not have a enforced type yet
		buttons: Collection<string, any>
		// rome-ignore lint/suspicious/noExplicitAny: menus do not have a enforced type yet
		menus: Collection<string, any>
		// rome-ignore lint/suspicious/noExplicitAny: modals do not have a enforced type yet
		modals: Collection<string, any>
	}
}

db.authenticate()
	.then(async () => {
		log.info("Database connected.")
	})
	.catch((err: Error) => {
		log.fatal(`Database could not authenticate: ${err.message}`)
		process.exit(1)
	})

client.login(process.env.DISCORD_TOKEN).then(async () => {
	log.info(`Connected as ${client.user?.tag}.`)
})

app.use(bodyParser.json())
app.use("/api", status)

app.listen(process.env.PORT, () => {
	log.info(`Listening on port ${process.env.PORT}.`)
})

export { app }
