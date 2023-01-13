import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from "discord.js";
import { client } from "..";
import { log } from "../services/logger";
import Util from "../utilities/general";
import { exec } from "child_process";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dev")
		.setDescription("Execute developer functions.")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) =>
			subcommand.setName("restart").setDescription("Restart the bot process")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("shutdown").setDescription("Shutdown the bot process.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("debug")
				.setDescription("See debugging related statistics.")
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const opt = interaction.options.getSubcommand();
		if (opt == "restart") {
			const date = new Date();
			log.debug(
				`Restart command issued by user ID ${interaction.user.id
				} at ${date.toTimeString()}.`
			);
			const embed = new EmbedBuilder()
				.setTitle("Restarting Container")
				.setDescription(
					`A manual restart has been issued by **${interaction.user.tag}** (\`${interaction.user.id
					}\`) at ${Util.formatTimestamp("dateAndRelative", date.getTime())}.`
				)
				.setColor("Grey");
			const channel = (await interaction.guild?.channels.fetch(
				"959911773480316938"
			)) as TextChannel;
			channel.send({ embeds: [embed] });
			await interaction.reply({ content: "✅" });
			exec("pm2 restart bit", function (error: any, stdout: any, stderr: any) {
				interaction.reply({
					content: `stdout: ${stdout}\n\nstderr: ${stderr}`,
				});
				if (error !== null) {
					interaction.channel?.send({ content: `exec error: ${error}` });
				}
			});
		} else if (opt == "shutdown") {
			const date = new Date();
			log.debug(
				`Shutdown command issued by user ID ${interaction.user.id
				} at ${date.toTimeString()}.`
			);
			const embed = new EmbedBuilder()
				.setTitle("Shutting Down Container")
				.setDescription(
					`A manual shutdown has been issued by **${interaction.user.tag}** (\`${interaction.user.id
					}\`) at ${Util.formatTimestamp("dateAndRelative", date.getTime())}.`
				)
				.setColor("Grey");
			const channel = (await interaction.guild?.channels.fetch(
				"959911773480316938"
			)) as TextChannel;
			channel.send({ embeds: [embed] });
			await interaction.reply({ content: "✅" });
			exec("pm2 stop bit", function (error: any, stdout: any, stderr: any) {
				interaction.reply({
					content: `stdout: ${stdout}\n\nstderr: ${stderr}`,
				});
				if (error !== null) {
					interaction.channel?.send({ content: `exec error: ${error}` });
				}
			});
		}
	},
};
