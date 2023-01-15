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
    return interaction.reply({ content: "Not implemented." });
  },
};
