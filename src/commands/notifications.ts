import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import Query from "../routes/Query";
import { NotificationOutput } from "../models/Notification";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notifications")
    .setDescription("View your last 5 unread notifications."),
  async execute(interaction: ChatInputCommandInteraction) {
    let notifications = (
      await Query.notifications.retrieveUnread(`${interaction.user.id}`)
    ).data as NotificationOutput[];
    let embed = new EmbedBuilder()
      .setTitle("Notification List")
      .setColor("Gold");
    let menu = new StringSelectMenuBuilder().setCustomId(
      `notifs-${interaction.user.id}`
    );
    if (notifications.length == 0) {
      embed.setDescription("You have no unread notifications.");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    for (let notif of notifications) {
      embed.addFields({
        name: `Subject: ${notif.subject}`,
        value: `Sent: <t:${notif.timestamp}:D>`,
      });
      let date = new Date(parseInt(notif.timestamp) * 1000);
      menu.addOptions({
        label: date.toDateString(),
        value: `${notif.id}`,
        description: notif.subject,
      });
    }

    let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      menu
    );
    await interaction.reply({
      content:
        "Use the menu below to view further details about a notification.",
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
