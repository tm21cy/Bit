import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { helpRoles } from "../types/help-roles"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("helper-roles")
		.setDescription("Manage your helper roles.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("join-or-leave")
				.setDescription("Join or leave a helper role for the languages/platforms/tech you know.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("list")
				.setDescription("Lists all the roles you can join or are currently in.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("ping")
				.setDescription("Ping a helper role.")
				.addStringOption((option) =>
					option
						.setName("role")
						.setDescription("The role to ping.")
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		// TODO: Dependent on database
		interaction.reply({
			content: "This command is not yet implemented.",
			ephemeral: true,
		})
	},
	async autocomplete(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused()
		// A maximum of 25 options can be returned
		const filtered = helpRoles.filter(helpRole => helpRole.startsWith(focusedValue)).slice(0, 25)
		await interaction.respond(
			filtered.map(helpRole => ({ name: helpRole, value: helpRole })),
		);
	}
}