import { Stopwatch } from "@sapphire/stopwatch"
import { codeBlock } from "@sapphire/utilities"
import axios from "axios"
import { Message } from "discord.js"
import { log } from "../services/logger"
import { Security } from "../services/security"
import { SecurityResponse } from "../types/Interfaces"

module.exports = {
	name: "eval",
	description: "Evaluates a code snippet.",
	aliases: ["ev", "evaluate"],
	async execute(message: Message, args: string[]) {
		await Security.isEvalerUser(message.author)
			.then(async (result: SecurityResponse) => {
				if (result.status !== 1) {
					message.reply(
						`\`\`\`diff\n-Security Service Error ${result.status}: ${result.message}\n\`\`\``
					)
					return
				} else {
					let code = args.join(" ")
					if (!code) {
						message.reply("**Error:** No code provided.")
						return
					}
					if (code.includes("await")) {
						code = `(async () => {\n${code}\n})();`
					}

					// rome-ignore lint/suspicious/noExplicitAny: the clean function is supposed to clean any type of input
					const clean = async (text: any) => {
						if (text && text.constructor.name === "Promise") text = await text
						if (typeof text !== "string")
							text = require("util").inspect(text, { depth: 1 })
						text = text
							.replace(/`/g, "`" + String.fromCharCode(8203))
							.replace(/@/g, `@${String.fromCharCode(8203)}`)
						return text
					}

					await Security.evalCheck(code, message.author)
						.then(async (result: SecurityResponse) => {
							if (result.status !== 1) {
								message.reply(
									`\`\`\`diff\n-Security Service Error ${result.status}: ${result.message}\n\`\`\``
								)
								return
							} else {
								try {
									const stopwatch = new Stopwatch()
									const evaled = eval(code)
									stopwatch.stop()
									const cleaned = await clean(evaled)
									const output = codeBlock("ts", cleaned)
									if (output.length > 2000) {
										axios
											.post("https://hst.sh/documents", cleaned)
											.then(async (res) => {
												message.channel.send(
													`https://hst.sh/${res.data.id} \n${stopwatch
														.stop()
														.toString()}`
												)
												return
											})
											.catch(async (err) => {
												message.channel.send(
													`\`\`\`js\nFailed to upload result: ${err}\n\`\`\``
												)
												log.error(err)
												return
											})
									}
									message.channel.send(
										`${output}\n${stopwatch.stop().toString()}`
									)
								} catch (err) {
									const cleaned = await clean(err)
									if (cleaned.length > 2000) {
										axios
											.post("https://hst.sh/documents", cleaned)
											.then(async (res) => {
												message.channel.send(`https://hst.sh/${res.data.id}`)
												return
											})
											.catch(async (err) => {
												message.channel.send(
													`\`\`\`js\nFailed to upload result: ${err}\n\`\`\``
												)
												log.error(err)
												return
											})
									}
									message.channel.send(`\`\`\`ts\n${cleaned}\n\`\`\``)
								}
							}
						})
						.catch((error: unknown) => {
							log.error(error, "Failed to check evaler user")
							message.reply(
								"```diff\nSecurity Service Error 2: Internal error\n```"
							)
						})
				}
			})
			.catch((error: unknown) => {
				log.error(
					error,
					`Failed to check evaler user ${message.author.tag} (${message.author.id})`
				)
				message.reply("```diff\nSecurity Service Error 2: Internal error\n```")
			})
	}
}
