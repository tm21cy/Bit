import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
  StringSelectMenuInteraction,
} from "discord.js";
import Query from "../routes/Query";
import { getColor } from "../utilities/profiles/render";
import Badges from "../utilities/profiles/badges";
import { ProfileOutput } from "../models/Profile";
import { CommentOutput } from "../models/Comment";
import ProfileBuilder from "../utilities/profiles/ProfileBuilder";
import Components from "../utilities/profiles/components";

module.exports = {
  name: "searchres",
  async execute(
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ) {
    await interaction.deferUpdate();
    let user = interaction.values[0];
    let profile = (await Query.profiles.getProfile({ user_id: user }))
      .data as ProfileOutput;
    await interaction.editReply({
      embeds: [await ProfileBuilder.renderHome(profile)],
      components: [await Components.Menu(user)],
    });
  },
};
