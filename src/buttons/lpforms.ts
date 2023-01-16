import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import Colors from "../enums/colors";
import Query from "../routes/Query";
import { HelperData } from "../types/Interfaces";

module.exports = {
  name: "lpforms",
  async execute(interaction: ButtonInteraction) {
    let userID = interaction.customId.split("-")[1];
    let opts: SelectMenuOptionBuilder[] = [];
    let homeBtn = new ButtonBuilder()
      .setCustomId(`home-${userID}`)
      .setLabel("Home")
      .setStyle(ButtonStyle.Primary);
    let langsBtn = new ButtonBuilder()
      .setCustomId(`leave-${userID}`)
      .setLabel("Languages")
      .setStyle(ButtonStyle.Primary);
    let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      homeBtn,
      langsBtn
    );
    let embed =
      interaction.message.embeds[0] ??
      new EmbedBuilder().setTitle("Leave Helper Roles").setColor(Colors.Indigo);
    let noneEmbed = new EmbedBuilder()
      .setTitle("No Roles")
      .setDescription("You have no platform roles to leave at this time.")
      .setColor(Colors.Indigo);
    let langs = (
      (await Query.helpers.retrieveRoles(userID, "platforms"))
        .data as HelperData
    ).langs as string[];
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
