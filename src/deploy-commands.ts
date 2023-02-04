import { REST } from "@discordjs/rest"
import { Stopwatch } from "@sapphire/stopwatch"
import { Routes } from "discord.js"
import fs from "fs"
import path from "path"
import { log } from "./services/logger"
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()

// rome-ignore lint/suspicious/noExplicitAny: commands currently do not have a enforced type
const commands: any = []
const commandsPath = path.join(__dirname, "commands")
// eslint-disable-next-line security/detect-non-literal-fs-filename
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	// eslint-disable-next-line security/detect-non-literal-require, @typescript-eslint/no-var-requires
	const command = require(filePath)
	commands.push(command.data.toJSON())
}

log.info(`Found ${commands.length} commands. Registering...`)
const time = new Stopwatch()

const rest = new REST({ version: "10" }).setToken(
	process.env.DISCORD_TOKEN as string
)

rest
	.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
		body: commands
	})
	.then(() => {
		log.info(
			`Successfully registered ${
				commands.length
			} commands in ${time.toString()}`
		)
	})
	.catch((error) => {
		time.stop()
		log.error(error, "Failed to register application commands.")
	})
