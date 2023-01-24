import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { ProfileOutput } from "../../models/Profile";
import render, { getColor } from "./render";
import Badges from "./badges";
import Query from "../../routes/Query";
import { CommentOutput } from "../../models/Comment";

export default class ProfileBuilder {
  static async renderHome(profile: ProfileOutput): Promise<EmbedBuilder> {
    return await render(profile);
  }

  static async renderBadges(profile: ProfileOutput): Promise<EmbedBuilder> {
    let badges = Badges.getBadges(profile.badge_flags);
    let desc = Badges.getDescriptions(profile.badge_flags).join("\n");
    if (desc.length == 0) desc = "This user has no badges.";
    return new EmbedBuilder()
      .setTitle(`${profile.display_name}'s Badges`)
      .setColor(getColor(badges.names))
      .setDescription(`${desc}`);
  }

  static async renderComments(
    profile: ProfileOutput,
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ): Promise<
    [EmbedBuilder, ActionRowBuilder<any>, ActionRowBuilder<ButtonBuilder>]
  > {
    let badges = Badges.getBadges(profile.badge_flags);
    let comments = (await Query.comments.retrieveComments(profile.user_id))
      .data as CommentOutput[];
    let desc: string[] = [];
    if (comments.length == 0) desc = ["No comments."];
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
      .setDescription(`${desc.join("\n")}`);

    let commentBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Add Comment")
      .setCustomId(`comment-${profile.user_id}`);
    let row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(commentBtn);
    let rowExisting = new ActionRowBuilder<any>().addComponents(
      interaction.component
    );

    return [embed, rowExisting, row1];
  }

  static async renderPortfolio(profile: ProfileOutput): Promise<EmbedBuilder> {
    let badges = Badges.getBadges(profile.badge_flags);
    return new EmbedBuilder()
      .setTitle(`${profile.display_name}'s Portfolio`)
      .setDescription("Coming soon!")
      .setColor(getColor(badges.names));
  }
}
