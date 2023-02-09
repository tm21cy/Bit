import { ButtonInteraction, ChannelType } from "discord.js"
import emoji from "../utilities/emojis.json"
import Util from "../utilities/general"

module.exports = {
	name: "helppostsolve",
	async execute(interaction: ButtonInteraction) {
		const action = interaction.customId.split("-")[1]

		if (!interaction.channel?.isThread()) {
			return interaction.editReply({
				content: "This command can only be used in threads."
			})
		}

		if (action !== "confirm" && action !== "cancel") {
			return interaction.editReply("Invalid action.")
		}

		switch (action) {
			case "confirm":
				const isAuthor = interaction.user.id === interaction.channel.ownerId
				interaction.message.edit({
					content: `${emoji.check} This post has been marked as solved by ${
						isAuthor ? "the author" : "a staff member"
					}.`,
					components: []
				})

				if (
					!interaction.channel.parent ||
					interaction.channel.parent.type !== ChannelType.GuildForum
				) {
					return Util.replyOrEdit(interaction, {
						content: "Something went wrong. Please try again.",
						ephemeral: true
					})
				}

				const solvedTag = interaction.channel.parent.availableTags.find(
					(tag) => tag.name === "Solved"
				)

				if (!solvedTag) {
					return Util.replyOrEdit(interaction, {
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

				Util.replyOrEdit(interaction, {
					content: "Done.",
					ephemeral: true
				})
				break
			case "cancel":
				interaction.message.edit({
					content:
						"The post still needs to be solved and was marked as such by the author.",
					components: []
				})

				Util.replyOrEdit(interaction, {
					content: "👍",
					ephemeral: true
				})
				break
		}
	}
}
