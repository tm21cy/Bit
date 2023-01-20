import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { languages } from "../types/help-roles";
import Query from "../routes/Query";
import Colors from "../enums/colors";
import { HelperOutput } from "../models/Helper";
import { HelperCollection } from "../types/Interfaces";

module.exports = {
  name: "leave",
  async execute(interaction: ButtonInteraction) {
    let userID = interaction.customId.split("-")[1];

    let opts: SelectMenuOptionBuilder[] = [];

    let homeBtn = new ButtonBuilder()
      .setCustomId(`home-${userID}`)
      .setLabel("Home")
      .setStyle(ButtonStyle.Primary);

    let platformsBtn = new ButtonBuilder()
      .setCustomId(`lpforms-${userID}`)
      .setLabel("Platforms")
      .setStyle(ButtonStyle.Primary);

    let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      homeBtn,
      platformsBtn
    );

    let embed =
      interaction.message.embeds[0] ??
      new EmbedBuilder().setTitle("Leave Helper Roles").setColor(Colors.Indigo);

    let noneEmbed = new EmbedBuilder()
      .setTitle("No Roles")
      .setDescription("You have no language roles to leave at this time.")
      .setColor(Colors.Indigo);

    let langs =
      (
        (await Query.helpers.retrieveRoles(userID, "langs"))
          .data as HelperCollection
      ).langs ?? [];

    if (langs.length == 0) {
      await interaction.update({
        embeds: [noneEmbed],
        components: [row2],
      });
      return;
    }
    for (let lang of langs) {
      opts.push(new SelectMenuOptionBuilder().setLabel(lang).setValue(lang));
    }
    let menu = new StringSelectMenuBuilder()
      .addOptions(opts)
      .setCustomId(`lroles-${userID}`)
      .setPlaceholder("Select roles to leave.")
      .setMaxValues(opts.length);

    let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      menu
    );

    await interaction.update({
      embeds: [embed],
      components: [row, row2],
    });
  },
};
