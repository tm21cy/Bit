import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tag")
		.setDescription("Use a tag."),
	async execute(interaction: ChatInputCommandInteraction) {

	}
}