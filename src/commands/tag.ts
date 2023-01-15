import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tag")
		.setDescription("Use a tag.")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("The name of the tag.")
				.setRequired(true)
			// .setAutocomplete(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {

		//const subcommand = interaction.options.getSubcommand();

		await interaction.reply({
			content: "This command is not yet implemented.",
			ephemeral: true,
		})
	}
}