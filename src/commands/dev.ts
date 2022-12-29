import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { client } from "..";
import { log } from "../services/logger";
import util from "../utilities/general";
import prettyMilliseconds from "pretty-ms"
import * as osu from "node-os-utils"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dev")
    .setDescription("Execute developer functions.")
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
        `Restart command issued by user ID ${
          interaction.user.id
        } at ${date.toTimeString()}.`
      );
      const embed = new EmbedBuilder()
        .setTitle("Restarting Container")
        .setDescription(
          `A manual restart has been issued by **${interaction.user.tag}** (\`${
            interaction.user.id
          }\`) at ${util.formatTimestamp("dateAndRelative", date.getTime())}.`
        )
        .setColor("Grey");
      const channel = (await interaction.guild?.channels.fetch(
        "959911773480316938"
      )) as TextChannel;
      channel.send({ embeds: [embed] });
      await interaction.reply({ content: "✅" });
      let exec = require("child_process").exec;
      exec("pm2 restart bit", function (error: any, stdout: any, stderr: any) {
        interaction.reply({
          content: `stdout: ${stdout}\n\nstderr: ${stderr}`,
        });
        if (error !== null) {
          interaction.channel?.send({ content: `exec error: ${error}` });
        }
      });
    } else if (opt == "shutdown") {
      await interaction.reply({ content: "Shutdown complete." })
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
