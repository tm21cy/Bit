import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Query from "../routes/Query";
import { ProfileOutput } from "../models/Profile";
import Util from "../utilities/general";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("thank")
    .setDescription("Thanks a user for helping you with your code issue!")
    .addUserOption((u) =>
      u.setName("user").setDescription("The user to thank.")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let date = new Date().getTime();
    let time = Math.round(date / 1000);
    let author = (
      await Query.profiles.getProfile({ user_id: interaction.user.id })
    ).data as ProfileOutput;
    let lastTime = parseInt(author.last_thank);
    if (time - lastTime < 3600) {
      let remaining = lastTime + 3600;
      return await interaction.reply({
        content: `You are on a cooldown for this command. You may try again <t:${remaining}:R>.`,
      });
    }
    let user = interaction.options.getUser("user", true).id;
    let profile = (await Query.profiles.getProfile({ user_id: user }))
      .data as ProfileOutput;
    await Query.profiles.increment(profile.id, "rep").then(async (profile) => {
      await Query.notifications.postNotification(
        user,
        "Rep Awarded!",
        `You've been given reputation by ${author.display_name}! Your new rep count is ${profile.count}.`
      );
      await Query.profiles.addRepCooldown(author.id, `${time}`);
      await interaction.reply({
        content: `Gave rep to ${profile.display_name}!`,
      });
    });
  },
};
