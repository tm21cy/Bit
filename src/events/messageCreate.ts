import axios from "axios"
import { Message } from "discord.js"
import { log } from "../services/logger"
import { Security } from "../services/security"

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message: Message) {
		const { client } = message

		if (message.author.id === "356950275044671499") {
			if (message.content === "<@947558235311849492> do it.") {
				message.channel.send(
					"<@&924773450441170954> <:angelsmile:944005687216836661>"
				)
				return
			}
		}

		if (message.author.bot) return

		const prefix = process.env.DEV_PREFIX as string
		if (message.content.startsWith(prefix) && !message.author.bot) {
			const args = message.content.slice(prefix.length).trim().split(/ +/)

			const commandName = args.shift()?.toLowerCase()
			if (commandName) {
				const command =
					(await client.textCommands.get(commandName)) ||
					(await client.textCommands.find((cmd) =>
						cmd.aliases?.includes(commandName)
					))

				if (!command) return

				if (!client.textCommands.has(command.name)) return

				try {
					//* Text commands will always be developer only.
					Security.isEvalerUser(message.author)
						.then((result) => {
							if (result.status !== 1) {
								log.warn(
									`${message.author.tag} (${message.author.id}) tried to use a developer only command.`
								)
								return
							}
						})
						.catch((err) => {
							log.error(err)
						})
					client.textCommands.get(command.name).execute(message, args)
				} catch (error) {
					const ID = log.error(
						error,
						`Command ${JSON.stringify(command)}, User: ${message.author.tag}(${
							message.author.id
						}), Guild: ${message.guild?.name}(${
							message.guildId
						}), Args: ${args}`,
						true
					)
					message.reply(
						`An error occurred while executing the command.\n\nError ID: ${ID}`
					)
				}
			}
		}

		if (message.guildId !== "924767148738486332") return
		if (!process.env.MICROSOFT_TRANSLATE_API_KEY) return
		if (message.content.length < 20) return

		// If a message repeats a word 5 times, return
		const words = message.content.split(" ")
		// rome-ignore lint/suspicious/noExplicitAny: I actually don't know what the types are and the code works
		const wordCount = words.reduce((acc: any, word: any) => {
			acc[word] = (acc[word] || 0) + 1
			return acc
		}, {})
		const repeatedWords = Object.keys(wordCount).filter(
			(word) => wordCount[word] > 4
		)
		if (repeatedWords.length > 0) return

		const endpoint = "https://api.cognitive.microsofttranslator.com"

		await axios
			.post(
				`${endpoint}/detect?api-version=3.0`,
				[
					{
						Text: message.content
					}
				],
				{
					headers: {
						"Ocp-Apim-Subscription-Key":
							process.env.MICROSOFT_TRANSLATE_API_KEY,
						// Region is North Central US
						"Ocp-Apim-Subscription-Region": "northcentralus",
						"Content-type": "application/json"
					}
				}
			)
			.then(async (response) => {
				const language = response.data[0].language
				if (language !== "en") {
					await axios
						.post(
							`${endpoint}/translate?api-version=3.0&to=${language}`,
							[
								{
									Text: "Please only speak English in this server."
								}
							],
							{
								headers: {
									"Ocp-Apim-Subscription-Key":
										process.env.MICROSOFT_TRANSLATE_API_KEY,
									// Region is North Central US
									"Ocp-Apim-Subscription-Region": "northcentralus",
									"Content-type": "application/json"
								}
							}
						)
						.then((response) => {
							const translatedMessage = response.data[0].translations[0].text
							message.reply(`${translatedMessage}`)
							log.info(
								`Translated message from ${message.author.username}#${message.author.discriminator} (${message.author.id}) from ${language} to English. Detected language: ${language}`
							)
						})
						.catch((error) => {
							log.error(error)
						})
				}
			})
			.catch((error) => {
				log.error(error)
			})
	}
}
