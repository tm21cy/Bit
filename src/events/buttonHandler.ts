import {
  ActionRowBuilder,
  ApplicationCommandType,
  Embed,
  EmbedBuilder,
  Interaction,
  InteractionType,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { log } from "../services/logger";
import { v4 as uuidv4 } from "uuid";
import { languages, platforms } from "../types/help-roles";
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    let cid = interaction.customId;

    if (cid.startsWith("join")) {
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
        new EmbedBuilder()
          .setTitle("Select Language Roles")
          .setColor("Blurple");

      await interaction.update({
        embeds: [embed],
        components: [row],
      });
    }
  },
};
