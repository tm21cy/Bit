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

module.exports = {
  name: "menu",
  async execute(
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ) {
    await interaction.deferUpdate();
    let uid = interaction.customId.split("-")[1];
    let profile = (await Query.profiles.getProfile({ user_id: uid }, 1))
      .data as ProfileOutput;
    let badges = Badges.getBadges(profile.badge_flags);
    switch (interaction.values[0]) {
      case "badges": {
        let description = Badges.getDescriptions(profile.badge_flags).join("\n");
        if (description == 0) description = "This user has no badges.";
        let embed = new EmbedBuilder()
          .setTitle(`${profile.display_name}'s Badges`)
          .setColor(getColor(badges.names))
          .setDescription(`${description}`);
        await interaction.editReply({
          embeds: [embed],
        });
        break;
      }
      case "comments": {
        let comments = (await Query.comments.retrieveComments(uid))
          .data as CommentOutput[];
        let description: string[] = [];
        if (comments.length == 0) description = ["No comments."];
        else {
          for (let comment of comments) {
            desc.push(
              `**${comment.author_tag}** - ${comment.message} (<t:${comment.timestamp}:f>)`
            );
          }
        }
        let embed = new EmbedBuilder()
          .setTitle(`${profile.display_name}'s Comments`)
          .setColor(getColor(badges.names))
          .setDescription(`${description.join("\n")}`);

        let commentBtn = new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("Add Comment")
          .setCustomId(`comment-${uid}`);
        let row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          commentBtn
        );
        let rowExisting = new ActionRowBuilder<any>().addComponents(
          interaction.component
        );
        await interaction.editReply({
          embeds: [embed],
          components: [rowExisting, row1],
        });
      }
    }
  },
};
