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
import { NotificationOutput } from "../models/Notification";

module.exports = {
  name: "notifs",
  async execute(
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ) {
    await interaction.deferUpdate();
    let id = interaction.values[0];
    await Query.notifications.markRead(parseInt(id));
    let notification = (await Query.notifications.getNotification(parseInt(id)))
      .data as NotificationOutput;
    let embed = new EmbedBuilder()
      .setTitle(notification.subject)
      .setDescription(notification.text)
      .addFields({
        name: "Sent at",
        value: `<t:${notification.timestamp}:D>`,
      })
      .setColor("Gold");

    let homebtn = new ButtonBuilder()
      .setLabel("Home")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`notifhome`);
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(homebtn);

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};
