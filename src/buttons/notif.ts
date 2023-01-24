import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Colors from "../enums/colors";
import Query from "../routes/Query";
import { ProfileOutput } from "../models/Profile";

module.exports = {
  name: "home",
  async execute(interaction: ButtonInteraction) {
    let type = interaction.customId.split("-")[1];
    let components = interaction.message.components;
    let embed = interaction.message.embeds[0];
    let profile = (
      await Query.profiles.getProfile({ user_id: interaction.user.id }, 1)
    ).data as ProfileOutput;
    switch (type) {
    } // TODO
  },
};
