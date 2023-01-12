import {
  ActionRowBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";

export default class Components {
  static async Menu(userID: string) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`menu-${userID}`)
      .setPlaceholder(`Tab Select`)
      .addOptions(
        {
          label: "Badges",
          description: "Show user badges.",
          value: "badges",
        },
        {
          label: "Comments",
          description: "Show comments on user profile.",
          value: "comments",
        },
        {
          label: "Portfolio",
          description: "Show user creations.",
          value: "portfolio",
        },
        {
          label: "Home",
          description: "User home page.",
          value: "home",
        }
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
  }
}
