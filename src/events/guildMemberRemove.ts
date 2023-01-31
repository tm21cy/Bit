import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	GuildMember
} from "discord.js"
import moment from "moment"

module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute(member: GuildMember) {
		if (member.guild.id !== "924767148738486332") return

		const leaveIdLogChannel =
			member.guild.channels.cache.get("928809456601550908") // #leave-id-log
		if (!leaveIdLogChannel?.isTextBased()) return

		const created = moment(member.user.createdTimestamp).fromNow()
		const joined = moment(member.joinedTimestamp).fromNow()
		const buttonType =
			member.user.createdTimestamp > Date.now() - 1209600000
				? ButtonStyle.Danger
				: ButtonStyle.Success

		const joinLogRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("creation-date")
				.setLabel(`Created ${created}`)
				.setStyle(buttonType)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("join-date")
				.setLabel(`Joined ${joined}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("username")
				.setLabel(`Username: ${member.user.tag}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		)

		leaveIdLogChannel.send({
			content: `${member.user.id}`,
			components: [joinLogRow]
		})
	}
}
