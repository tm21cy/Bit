import { stripIndents } from "common-tags"
import {
	ChannelType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js"
import Color from "../enums/colors"
import emoji from "../utilities/emojis.json"
import Util from "../utilities/general"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help-post")
		.setDescription("Manages help posts.")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("solve")
				.setDescription("Marks a help post as solved. Author or staff only.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("solve-request")
				.setDescription(
					"Asks the author of a help post if their question has been solved. Staff only."
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.channel?.type !== ChannelType.PublicThread) {
			return interaction.reply({
				content: "This command can only be used in a thread channel.",
				ephemeral: true
			})
		}

		if (interaction.channel.parentId !== "1047939316514570312") {
			return interaction.reply({
				content: "This command can only be used <#1047939316514570312>.",
				ephemeral: true
			})
		}

		const subcommand = interaction.options.getSubcommand()
		const isStaff = (
			await interaction.guild?.members.fetch(interaction.user.id)
		)?.roles.cache.has("924773450441170954")

		switch (subcommand) {
			case "solve": {
				if (
					interaction.user.id !== interaction.channel.ownerId && // Author
					!isStaff // Staff
				) {
					return interaction.reply({
						content:
							"You must be the author of the post or staff to use this command.",
						ephemeral: true
					})
				}

				if (isStaff) {
					const confirmationEmbed = new EmbedBuilder()
						.setTitle("Are you sure?")
						.setDescription(
							"Only close posts manually if the author has left the server or hasn't responded on whether the question has been solved or not."
						)
						.setColor(Color.Orange)

					const confirmationRow =
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							new ButtonBuilder()
								.setCustomId("helppostsolve-confirm")
								.setLabel("Yes")
								.setStyle(ButtonStyle.Success),
							new ButtonBuilder()
								.setCustomId("helppostsolve-cancel")
								.setLabel("No")
								.setStyle(ButtonStyle.Danger)
						)

					interaction.reply({
						embeds: [confirmationEmbed],
						components: [confirmationRow],
						ephemeral: true
					})
				} else {
					interaction.channel.send({
						content: `${emoji.check} This post has been marked as solved by the author.`
					})

					if (
						!interaction.channel.parent ||
						interaction.channel.parent.type !== ChannelType.GuildForum
					) {
						return interaction.reply({
							content: "Something went wrong. Please try again.",
							ephemeral: true
						})
					}

					const solvedTag = interaction.channel.parent.availableTags.find(
						(tag) => tag.name === "Solved"
					)

					if (!solvedTag) {
						return interaction.reply({
							content: "Something went wrong. Please try again.",
							ephemeral: true
						})
					}

					interaction.channel.appliedTags.push(solvedTag.id)

					interaction.channel.setAppliedTags(
						interaction.channel.appliedTags,
						`Question marked as solved by ${interaction.user.tag} (${
							interaction.user.id
						}). Author? ${interaction.channel.ownerId === interaction.user.id}.`
					)

					interaction.channel.setArchived(true, "Question marked as solved.")

					interaction.reply({
						content: "Done.",
						ephemeral: true
					})
				}
				break
			}
			case "solve-request": {
				if (!isStaff) {
					interaction.reply({
						content: "Only staff members can use this command.",
						ephemeral: true
					})
				}

				const confirmationRow =
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setCustomId("helppostsolve-confirm")
							.setLabel("Close and mark as solved")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId("helppostsolve-cancel")
							.setLabel("Leave open")
							.setStyle(ButtonStyle.Secondary)
					)

				interaction.channel.send({
					content: stripIndents`
						Hey <@${interaction.channel.ownerId}>,

						It looks like this help post has been solved. Can we mark it as such? Thanks!`,
					components: [confirmationRow]
				})

				Util.replyOrEdit(interaction, {
					content: "Done.",
					ephemeral: true
				})
				break
			}
		}
	}
}
