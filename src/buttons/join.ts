import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { languages } from "../types/help-roles";

module.exports = {
  name: "join",
  async execute(interaction: ButtonInteraction) {
    let cid = interaction.customId;
    const userID = cid.split("-")[1];
    let opts: SelectMenuOptionBuilder[] = [];
    for (let lang of languages) {
      opts.push(new SelectMenuOptionBuilder().setLabel(lang).setValue(lang));
    }
    let menu = new StringSelectMenuBuilder()
      .addOptions(opts)
      .setCustomId(`jroles-${cid}`)
      .setPlaceholder("Select languages to add.")
      .setMaxValues(opts.length);

    let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      menu
    );

    let embed =
      interaction.message.embeds[0] ??
      new EmbedBuilder().setTitle("Select Language Roles").setColor("Blurple");

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
