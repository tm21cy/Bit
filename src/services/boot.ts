/* eslint-disable indent */
import { bgMagentaBright } from "colorette";
import * as dotenv from "dotenv";
import { log } from "./logger";
import Util from "../utilities/general";
import { Client } from "discord.js";
import { exec } from "child_process";
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
	public static async init(): Promise<void> {
		const environment = process.env.NODE_ENV;
		if (!environment) {
			log.fatal("NODE_ENV environment variable is not set");
			boot.exit(1);
		}

		switch (true) {
			case !process.env.DISCORD_TOKEN:
				log.fatal("DISCORD_TOKEN is not set in .env");
				boot.exit(1);
				break;
			case !process.env.CLIENT_ID:
				log.fatal("CLIENT_ID is not set in .env");
				boot.exit(1);
				break;
			case Util.decodeBase64(
				process.env.DISCORD_TOKEN?.split(".")[0] as string
			) !== process.env.CLIENT_ID:
				log.fatal(
					"Client ID found in DISCORD_TOKEN and CLIENT_ID do not match."
				);
				boot.exit(1);
				break;
		}

		log.info(
			`Passed boot checks successfully. Starting in ${bgMagentaBright(
				boot.environment()
			)} mode.`
		);
	}

	/**
	 * Gives the current environment the bot is running in. If not set, it will return "development".
	 * @returns {string} The environment the bot is running in.
	 */
	public static environment(): string {
		return process.env.NODE_ENV ?? "development";
	}

	/**
	 * Exists the process with the given code. If no code is given, it will exit with code 0.
	 * @param {number} [code=0] The exit code.
	 * @returns {void}
	 */
	public static exit(code = 0): void {
		log.fatal(`Exiting with code ${code ?? 0}. Exit Function Called.`);
		process.exit(code);
	}

	/**
	 * Auto-registers new commands to the bot if changes are detected.
	 * @param {Client} client The client to check existing commands from.
	 */
	public static async checkAndRegisterCommands(client: Client): Promise<void> {
		let clientCommands = await client.application?.commands.fetch();
		if (!clientCommands) return;
		clientCommands = clientCommands.filter((command) => command.guildId === null);

		let knownCommands = client.commands

		let changed = false;

		if (clientCommands.size !== knownCommands.size) {
			log.info("Commands have changed. Updating commands...");
			changed = true;
			return
		}

		for await (const command of clientCommands.values()) {
			if (!knownCommands.has(command.name)) {
				log.info(`Detected new command: ${command.name}`);
				changed = true;
			}

			const knownCommand = knownCommands.get(command.name);
			if (!knownCommand) continue;

			if (command.description !== knownCommand.description) {
				log.info(`Detected changed description for command: ${command.name}`);
				changed = true;
			}
		}

		if (changed) {
			log.info("Commands have changed. Updating commands...");
			exec("pnpm cmd-deploy", (err, stdout, stderr) => {
				if (err) {
					log.error(err);
					return;
				}
				log.info(stdout);
				log.error(stderr);
			});
			log.info("Commands have been updated.");
		} else {
			log.info("Commands are up to date.");
		}
	}
}

export default boot;
