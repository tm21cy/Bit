import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Colors from "../enums/colors";

module.exports = {
  name: "home",
  async execute(interaction: ButtonInteraction) {
    let uid = interaction.customId.split("-")[1];
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

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
