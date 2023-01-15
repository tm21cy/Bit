import { AttachmentBuilder, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { feedbackPalNotificationAccepted, generateApplicationMessage } from "../types/applicationNotifications"
import Util from "../utilities/general"

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
							{ name: "Denied", value: "denied" },
						)
				)
				.addStringOption((option) => 
					option
						.setName("application")
						.setDescription("The application this status update is related to.")
						.setRequired(true)
						.addChoices(
							{ name: "Staff", value: "staff" },
							{ name: "Proficient", value: "proficient"},
							{ name: "Fluent", value: "fluent"},
							{ name: "Feedback pal", value: "feedback-pal" }
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

		await interaction.deferReply()
		let errors: any[] = []

		/* Notify applicants */
		const status = interaction.options.getString("status") as "accepted" | "denied"
		const application = interaction.options.getString("application") as "staff" | "proficient" | "fluent" | "feedback-pal"
		const applicants = interaction.options.getString("applicants-ids")
		const reason = interaction.options.getString("reason")

		/* List */
		const listType = interaction.options.getString("list-type") as "role" | "joined" | "left"
		const role = interaction.options.getRole("role")
		const count = interaction.options.getString("count")
		let members
		let file
		let channel
		let messages

		/* Tags */
		const tagName = interaction.options.getString("name")
		const tagRole = interaction.options.getRole("role")

		switch (subcommand) {
			case "notify-applicants":
				if (!status) return interaction.editReply("You must provide the type of application status update to send.")
				if (!application) return interaction.editReply("You must provide the application this status update is related to.")
				if (!applicants) return interaction.editReply("You must provide a list of applicants.")
				switch (application) {
					case "feedback-pal":
						if (status === "denied") {
							interaction.editReply("You cannot deny feedback-pal applications.")
							return
						}
						for await (const applicant of applicants) {
							const member = await interaction.guild?.members.fetch(applicant)
							if (!member) {
								errors.push({
									applicant,
									error: "Member not found.",
								})
								continue
							}
							try {
								await member.send({
									content: feedbackPalNotificationAccepted(member.user.tag),
									allowedMentions: { parse: [] },
								})
							} catch (error) {
								errors.push({
									applicant,
									error: error,
								})
							}
						}
						interaction.editReply({
							content: `Successfully notified ${applicants.length} applicants. Failed to notify ${errors.length} applicants: ${errors.map((error) => `${error.applicant}: ${error.error}`).join("\n")}`,
						})
					break
					default:
						for await (const applicant of applicants) {
							const member = await interaction.guild?.members.fetch(applicant)
							if (!member) {
								errors.push({
									applicant,
									error: "Member not found.",
								})
								continue
							}
							try {
								await member.send({
									content: generateApplicationMessage(application, status, reason, member.user.tag),
									allowedMentions: { parse: [] },
								})
							} catch (error) {
								errors.push({
									applicant,
									error: error
								})
							}
						}
						interaction.editReply({
							content: `Successfully notified ${applicants.length} applicants. Failed to notify ${errors.length} applicants: ${errors.map((error) => `${error.applicant}: ${error.error}`).join("\n")}`,
						})
				}

				break
			case "list":
				if (!listType) return interaction.editReply("You must provide the type of list to generate.")
				if (listType === "role" && !role) return interaction.editReply("You must provide a role to list.")
				if (listType === "joined" && !count) return interaction.editReply("You must provide a number of users to list.")
				if (listType === "left" && !count) return interaction.editReply("You must provide a number of users to list.")

				switch (listType) {
					case "role":
						if (!role) return interaction.editReply("You must provide a role to list.")
						await interaction.guild?.members.fetch()
						await interaction.guild?.roles.fetch()

						members = interaction.guild?.members.cache.filter((member) => member.roles.cache.has(role.id))
						if (!members) return interaction.editReply("No members found with that role.")
						if (count) members = members.first(parseInt(count))
						members = Array.from(members.values())
						members = members.map((member) => `${member.user.tag} (${member.id}) Created ${Util.generateTimestamp("f", member.user.createdTimestamp)}`)
						if (members.length > 1900) {
							file = new AttachmentBuilder(Buffer.from(members.join("\n")), {
								name: "members.txt",
							})
						}

						interaction.editReply({
							content: `Showing ${members.length} members: ${file ? "" : members.join("\n")}`,
							files: file ? [file] : [],
						})
						break
					case "joined":
						if (!count) return interaction.editReply("You must provide a number of users to list.")
						if (!parseInt(count)) return interaction.editReply("You must provide a valid number of users to list.")
						if (parseInt(count) > 100) return interaction.editReply("You can only list up to 100 users.")
						let channel = interaction.guild?.channels.cache.get("928779076225871903")
						if (!channel?.isTextBased()) return
						
						messages = await channel.messages.fetch({ limit: parseInt(count) })
						messages = messages.map((message) => message.content)

						if (messages.length > 1900) {
							file = new AttachmentBuilder(Buffer.from(messages.join("\n")), {
								name: "members.txt",
							})
						}

						interaction.editReply({
							content: `Showing ${messages.length} members: ${file ? "" : messages.join("\n")}`,
							files: file ? [file] : [],
						})
						break
					case "left":
						if (!count) return interaction.editReply("You must provide a number of users to list.")
						if (!parseInt(count)) return interaction.editReply("You must provide a valid number of users to list.")
						if (parseInt(count) > 100) return interaction.editReply("You can only list up to 100 users.")
						channel = interaction.guild?.channels.cache.get("928809456601550908")
						if (!channel?.isTextBased()) return

						messages = await channel.messages.fetch({ limit: parseInt(count) })
						messages = messages.map((message) => message.content)

						if (messages.length > 1900) {
							file = new AttachmentBuilder(Buffer.from(messages.join("\n")), {
								name: "members.txt",
							})
						}

						interaction.editReply({
							content: `Showing ${messages.length} members: ${file ? "" : messages.join("\n")}`,
							files: file ? [file] : [],
						})
						break
				}
				break
		}

		switch (subcommandGroup) {
			case "tags":
				switch (subcommand) {
					case "create":
						if (!tagName) return interaction.editReply("You must provide a name for the tag.")
						
						interaction.editReply({
							content: "Command disabled.",
						})
						break
					case "delete":
						if (!tagName) return interaction.editReply("You must provide a name for the tag.")

						interaction.editReply({
							content: "Command disabled.",
						})
						break
		}
	}
	}
}