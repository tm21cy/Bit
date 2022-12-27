import { CommandInteraction, SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("418")
		.setDescription("I'm a teapot."),
	async execute(interaction: CommandInteraction) {
		return interaction.reply({ content: "I'm a teapot." })
	}
}