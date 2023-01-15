import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GuildMember } from "discord.js";
import moment from "moment";
import normalize from "../services/normalizer";

module.exports = {
	name: "guildMemberAdd",
	once: false,
	async execute(member: GuildMember) {
		if (member.guild.id !== "924767148738486332") return

		const joinIdLogChannel = member.guild.channels.cache.get("928779076225871903") // #join-id-log
		if (!joinIdLogChannel || !joinIdLogChannel.isTextBased()) return
		
		const created = moment(member.user.createdTimestamp).fromNow()
		const buttonType = member.user.createdTimestamp > Date.now() - 1209600000
			? ButtonStyle.Danger
			: ButtonStyle.Success

		const joinLogRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('creation-date')
					.setLabel(`Created ${created}`)
					.setStyle(buttonType)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId("username")
					.setLabel(`Username: ${member.user.tag}`)
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
			);

		joinIdLogChannel.send({
			content: `${member.user.id}`,
			components: [joinLogRow],
		})

		if (member.user.bot) return
		if (!member.manageable) return
		let fixedName = await normalize.normalize(member.displayName)
		if (fixedName === member.displayName) return
		if (fixedName.length == 1 || fixedName.length == 0) fixedName = await normalize.randNameStr("Moderated Username ")
		member.setNickname(fixedName, "Automatic username clean")

	},
};
