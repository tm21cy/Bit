import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js"

module.exports = {
	name: "comment",
	async execute(interaction: ButtonInteraction) {
		let uid = interaction.customId.split("-")[1]
		let modal = new ModalBuilder()
			.setTitle("Leave a Comment")
			.setCustomId(`commentmodal-${uid}`)
		let textrow = new TextInputBuilder()
			.setCustomId("commentin1")
			.setRequired(true)
			.setLabel("Comment Text")
			.setStyle(TextInputStyle.Paragraph)

		let row = new ActionRowBuilder<TextInputBuilder>().addComponents(textrow)
		modal.addComponents(row)

		await interaction.showModal(modal)
	}
}
