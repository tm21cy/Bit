import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { platforms } from "../types/help-roles";
import Colors from "../enums/colors";

module.exports = {
  name: "pforms",
  async execute(interaction: ButtonInteraction) {
    let cid = interaction.customId;
    const userID = cid.split("-")[1];
    let opts: SelectMenuOptionBuilder[] = [];
    for (let plt of platforms) {
      opts.push(new SelectMenuOptionBuilder().setLabel(plt).setValue(plt));
    }
    let menu = new StringSelectMenuBuilder()
      .addOptions(opts)
      .setCustomId(`jroles-${userID}`)
      .setPlaceholder("Select platforms to add.")
      .setMaxValues(opts.length);

    let homeBtn = new ButtonBuilder()
      .setCustomId(`home-${userID}`)
      .setLabel("Home")
      .setStyle(ButtonStyle.Primary);

    let langsBtn = new ButtonBuilder()
      .setCustomId(`join-${userID}`)
      .setLabel("Languages")
      .setStyle(ButtonStyle.Primary);

    let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      menu
    );

    let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      homeBtn,
      langsBtn
    );

    let embed =
      interaction.message.embeds[0] ??
      new EmbedBuilder()
        .setTitle("Select Platform Roles")
        .setColor(Colors.Indigo);

    await interaction.update({
      embeds: [embed],
      components: [row, row2],
    });
  },
};
