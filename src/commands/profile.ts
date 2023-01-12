import {
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import Query from "../routes/Query";
import { ProfileData } from "../types/Interfaces";
import render from "../utilities/profiles/render";
import Components from "../utilities/profiles/components";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Profile commands for Bit's internal social network.")
    .addSubcommand((c) =>
      c.setName("display").setDescription("Displays your own profile.")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    if (sub == "display") {
      let profile = (
        (await Query.profiles.getProfile({ user_id: `${interaction.user.id}` }))
          .data as ProfileData[]
      )[0];
      let embed = await render(profile);
      let menu = await Components.Menu(`${interaction.user.id}`);

      await interaction.reply({ embeds: [embed], components: [menu] });
    }
  },
};
