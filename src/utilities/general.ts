import { InteractionReplyOptions, TimestampStylesString } from "discord.js"
import { RepliableInteraction } from "../types/Types"

/**
 * Provides general utility functions which cannot be categorized.
 * @class
 */
class Util {
	/**
	 * Decodes a base64 string.
	 * @param {string} base64String The base64 string to decode.
	 * @returns {string} The decoded string.
	 */
	public static decodeBase64(base64String: string): string {
		return Buffer.from(base64String, "base64").toString("ascii")
	}

	/**
	 * Verifies the authenticity of a developer's usage of a command.
	 * @param id The ID of the user using the command.
	 * @returns
	 */
	public static verifyDev(id: string): boolean {
		return id === process.env.DEV_ID_1 || id === process.env.DEV_ID_1
	}

	public static formatTimestamp(
		option: "date" | "dateAndRelative" | "relative",
		timestamp: number
	): string {
		switch (option) {
			case "date":
				return `<t:${Math.round(timestamp / 1000)}>`
			case "dateAndRelative":
				return `<t:${Math.round(timestamp / 1000)}> (<t:${Math.round(
					timestamp / 1000
				)}:R>)`
			case "relative":
				return `<t:${Math.round(timestamp / 1000)}:R>`
		}
	}

	public static generateTimestamp(
		style: TimestampStylesString,
		timestamp: number | Date,
		addRelative = false
	) {
		if (typeof timestamp === typeof Date) {
			timestamp = Math.round((timestamp as Date).getTime() / 1000)
		} else {
			timestamp = Math.round((timestamp as number) / 1000)
		}

		return `<t:${timestamp}:${style}>${
			addRelative ? ` (<t:${timestamp}:R>)` : ""
		}`
	}

	/**
	 * Replies to an interaction or edits the reply if the interaction has already been replied to. Sets ephemeral to undefined if the interaction has already been replied to.
	 * @param {RepliableInteraction} interaction The interaction to reply to.
	 * @param {InteractionReplyOptions} content The content to reply with.
	 */
	public static replyOrEdit(
		interaction: RepliableInteraction,
		content: InteractionReplyOptions
	) {
		if (interaction.replied) {
			content.ephemeral = undefined
			interaction.editReply(content)
		} else {
			interaction.reply(content)
		}
	}
}

export default Util
