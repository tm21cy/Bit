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

module.exports = {
  name: "menu",
  async execute(
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ) {
    await interaction.deferUpdate();
    let uid = interaction.customId.split("-")[1];
    let menu = new ActionRowBuilder<any>().addComponents(interaction.component);
    let profile = (await Query.profiles.getProfile({ user_id: uid }, 1))
      .data as ProfileOutput;
    let badges = Badges.getBadges(profile.badge_flags);
    switch (interaction.values[0]) {
      case "badges": {
        await interaction.editReply({
          embeds: [await ProfileBuilder.renderBadges(profile)],
          components: [menu],
        });
        break;
      }
      case "comments": {
        let components = await ProfileBuilder.renderComments(
          profile,
          interaction
        );
        await interaction.editReply({
          embeds: [components[0]],
          components: [components[1], components[2]],
        });
        break;
      }
      case "home": {
        await interaction.editReply({
          embeds: [await ProfileBuilder.renderHome(profile)],
          components: [menu],
        });
        break;
      }
    }
  },
};
