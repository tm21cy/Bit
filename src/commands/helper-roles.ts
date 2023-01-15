import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { languages, platforms } from "../types/help-roles";
import Color from "../enums/colors";
import Colors from "../enums/colors";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("helper-roles")
    .setDescription("Manage your helper roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join-or-leave")
        .setDescription(
          "Join or leave a helper role for the languages/platforms/tech you know."
        )
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
    let joinBtn = new ButtonBuilder()
      .setCustomId(`join-${interaction.user.id}`)
      .setStyle(ButtonStyle.Success)
      .setLabel("Join Roles");
    let leaveBtn = new ButtonBuilder()
      .setCustomId(`leave-${interaction.user.id}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel("Leave Roles");
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      joinBtn,
      leaveBtn
    );
    let embed = new EmbedBuilder()
      .setTitle("Helper Role Membership Panel")
      .setDescription(
        "Using the buttons below to open interfaces, join and leave helper roles by interacting with the select menu."
      )
      .setColor(Colors.Indigo);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const helpRoles = [...languages, ...platforms];
    // A maximum of 25 options can be returned
    const filtered = helpRoles
      .filter((helpRole) => helpRole.startsWith(focusedValue))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((helpRole) => ({ name: helpRole, value: helpRole }))
    );
  },
};
