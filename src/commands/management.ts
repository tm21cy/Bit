import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("management")
		.setDescription("General server management functions.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("notify-applicants")
				.setDescription("Notify applicants of their application status.")
				.addStringOption((option) =>
					option
						.setName("status")
						.setDescription("The status of the applicants to notify.")
						.setRequired(true)
						.addChoices(
							{ name: "Accepted", value: "accepted" },
							{ name: "Rejected", value: "rejected" },
						)
				)
				.addStringOption((option) => 
					option
						.setName("application")
						.setDescription("The application this status update is related to.")
						.setRequired(true)
						.addChoices(
							{ name: "staff", value: "staff" },
							{ name: "proficient", value: "proficient"},
							{ name: "fluent", value: "fluent"}
						)
				)
				.addStringOption((option) =>
					option
						.setName("applicants-ids")
						.setDescription("The IDs of the applicants to notify.")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("reason")
						.setDescription("The reason for the status.")
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("list")
				.setDescription("Lists users in a role, or users who have left or joined the server.")
				.addStringOption((option) =>
					option
						.setName("list-type")
						.setDescription("The type of list to generate.")
						.setRequired(true)
						.addChoices(
							{ name: "Role", value: "role" },
							{ name: "Joined", value: "joined" },
							{ name: "Left", value: "left" },
						)
				)
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription("The role to list.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("count")
						.setDescription("The number of users to list.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("additional-options")
						.setDescription("Additional options for the list.")
						.setRequired(false)
						.addChoices(
							{ name: "IDs only", value: "ids" },
							{ name: "Include creation date", value: "creation-date" },
						
						)
				)
		)
		.addSubcommandGroup((group) =>
			group
				.setName("tags")
				.setDescription("Manage tags.")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("create")
						.setDescription("Create a tag.")
						.addStringOption((option) =>
							option
								.setName("name")
								.setDescription("The name of the tag.")
								.setRequired(true)
						)
						.addRoleOption((option) =>
							option
								.setName("role")
								.setDescription("The role that can use the tag.")
								.setRequired(false)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("delete")
						.setDescription("Delete a tag.")
						.addStringOption((option) =>
							option
								.setName("name")
								.setDescription("The name of the tag.")
								.setRequired(true)
						)
				)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction: ChatInputCommandInteraction) {
		const subcommandGroup = interaction.options.getSubcommandGroup()
		const subcommand = interaction.options.getSubcommand()

		/* Notify applicants */
		const status = interaction.options.getString("status")
		const application = interaction.options.getString("application")
		const applicants = interaction.options.getString("applicants-ids")
		const reason = interaction.options.getString("reason")

		/* List */
		const listType = interaction.options.getString("list-type")
		const role = interaction.options.getRole("role")
		const count = interaction.options.getString("count")
		const additionalOptions = interaction.options.getString("additional-options")

		/* Tags */
		const tagName = interaction.options.getString("name")
		const tagRole = interaction.options.getRole("role")

		switch (subcommand) {
			case "notify-applicants":
				if (!status) return interaction.reply("You must provide the type of application status update to send.")
				if (!application) return interaction.reply("You must provide the application this status update is related to.")
				if (!applicants) return interaction.reply("You must provide a list of applicants.")
				if (status === "rejected" && !reason) return interaction.reply("You must provide a reason for denial.")

				//TODO

				break
			case "list":
				if (!listType) return interaction.reply("You must provide the type of list to generate.")
				if (listType === "role" && !role) return interaction.reply("You must provide a role to list.")
				if (listType === "joined" && !count) return interaction.reply("You must provide a number of users to list.")
				if (listType === "left" && !count) return interaction.reply("You must provide a number of users to list.")

				//TODO
				break
		}

		switch (subcommandGroup) {
			case "tags":
				switch (subcommand) {
					case "create":
						if (!tagName) return interaction.reply("You must provide a name for the tag.")
						break
					case "delete":
						if (!tagName) return interaction.reply("You must provide a name for the tag.")
						break
		}
	}
	}
}