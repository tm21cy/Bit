import fs from "fs"
import path from "path"
import { Routes } from "discord.js"
import { REST } from "@discordjs/rest"
import { log } from "./services/logger"
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()
import { Stopwatch } from "@sapphire/stopwatch"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

console.log(rest.get(Routes.applicationCommands(process.env.CLIENT_ID as string)))

rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: commands })
	.then(() => {
		log.info(`Successfully registered ${commands.length} commands in ${time.toString()}`)
	})
	.catch((error) => {
		time.stop()
		log.error(error, "Failed to register application commands.")
	})
