import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, GuildMember } from "discord.js";
import moment from "moment";
import Color from "../enums/colors";
import { JoinAlertOutput } from "../models/JoinAlert";
import Query from "../routes/Query";
import normalize from "../services/normalizer";
import { Status } from "../types/Interfaces";

module.exports = {
	name: "guildMemberAdd",
	once: false,
	async execute(member: GuildMember) {
		if (member.guild.id !== "924767148738486332") return

		const joinIdLogChannel = await member.guild.channels.fetch("928779076225871903") // #join-id-log
		if (!(joinIdLogChannel?.isTextBased())) return
		
		const created = moment(member.user.createdTimestamp).fromNow()
		const createdButtonStyle = member.user.createdTimestamp > Date.now() - 1209600000
			? ButtonStyle.Danger
			: ButtonStyle.Success
		const userJoinAlert = (await Query.joinAlerts.isUserJoinAlert(member.guild.id, member.user.id))
		const alertButtonStyle = userJoinAlert.status === Status.NOTFOUND ? ButtonStyle.Success : ButtonStyle.Danger

		const joinLogRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("creation-date")
				.setLabel(`Created ${created}`)
				.setStyle(createdButtonStyle)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("username")
				.setLabel(`Username: ${member.user.tag}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("join-alert")
				.setLabel(
					`Has Join Alert: ${
						userJoinAlert.status === Status.NOTFOUND ? false : true
					}`,
				)
				.setStyle(alertButtonStyle)
				.setDisabled(true),
		);

		joinIdLogChannel.send({
			content: `${member.user.id}`,
			components: [joinLogRow],
		})

		if (userJoinAlert.status !== (Status.NOTFOUND || Status.ERROR)) {
			const joinAlertChannel = await member.guild.channels.fetch("933381980488335390"); // #alerts
			if (!(joinAlertChannel?.isTextBased())) return

			// Using <Client>.users.fetch() instead of <GuildMember>.fetch() because the latter would fail if the moderator left the server.
			const moderator = await member.client.users.fetch((userJoinAlert.data as JoinAlertOutput).moderator_id)

			const alertEmbed = new EmbedBuilder()
				.setAuthor({
					name: `Moderator ${moderator.tag} (${moderator.id})`,
					iconURL: moderator.displayAvatarURL(),
				})
				.setTitle("Join Alert")
				.setDescription(
					`User ${member.toString()} (${member.user.tag}, \`${
						member.user.id
					}\`)  has joined and has an active join alert.`,
				)
				.addFields({
					name: "Reason",
					value: (userJoinAlert.data as JoinAlertOutput).reason ?? "No reason provided",
				})
				.setThumbnail(member.user.displayAvatarURL())
				.setColor(Color.Red)
				.setTimestamp();

			joinAlertChannel.send({
				content: `${moderator.toString()}`,
				embeds: [alertEmbed],
			})
		}

		if (member.user.bot) return;
		if (!member.manageable) return
		let fixedName = await normalize.normalize(member.displayName)
		if (fixedName === member.displayName) return
		if (fixedName.length === 1 || fixedName.length === 0) fixedName = await normalize.randNameStr("Moderated Username ")
		member.setNickname(fixedName, "Automatic username clean")

	},
};
