import { EmbedBuilder, TextChannel } from "discord.js"
import Color from "../../enums/colors"
import { client } from "../../index"
import { Data } from "../../types/Interfaces"

export default function actionLog(
	component:
		| "Comments"
		| "Helpers"
		| "LikeUsers"
		| "Notifications"
		| "Profiles",
	action: "GET" | "POST" | "PATCH" | "DELETE",
	data: Data,
	user: string
) {
	let loggingChannel = process.env.LOGGING
	if (!loggingChannel) throw new Error("No logging channel provided.")
	let embed = new EmbedBuilder().setColor(Color.Red)
	let userObj = client.users.resolve(user)
	embed.setTitle(`New ${action} Action - ${component}`)
	embed.setDescription(JSON.stringify(data, null, 4))
	embed.addFields({
		name: "Responsible User",
		value: `${user} (${userObj?.tag})`
	})
	return (client.channels.resolve(loggingChannel) as TextChannel).send({
		embeds: [embed]
	})
}
