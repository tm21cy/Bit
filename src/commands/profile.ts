import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import Query from "../routes/Query";
import { Status } from "../types/Interfaces";
import render from "../utilities/profiles/render";
import Components from "../utilities/profiles/components";
import Colors from "../enums/colors";
import { ProfileOutput } from "../models/Profile";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Profile commands for Bit's internal social network.")
    .addSubcommand((c) =>
      c.setName("display").setDescription("Displays your own profile.")
    )
    .addSubcommand((c) =>
      c
        .setName("register")
        .setDescription("Registers your profile on our system.")
    )
    .addSubcommand((c) =>
      c
        .setName("search")
        .setDescription("Search for a profile via display name.")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("The display name to search.")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "display": {
        let profile = (
          await Query.profiles.getProfile({
            user_id: `${interaction.user.id}`,
          })
        ).data as ProfileOutput;
        let embed = await render(profile);
        let menu = await Components.Menu(`${interaction.user.id}`);

        await interaction.reply({ embeds: [embed], components: [menu] });
        break;
      }

      case "register": {
        let profile = (
          (
            await Query.profiles.getProfile({
              user_id: `${interaction.user.id}`,
            })
          ).data as ProfileOutput[]
        )[0];
        if (profile) {
          let embed = new EmbedBuilder()
            .setTitle("Existing Profile Found")
            .setDescription(
              `It appears you have a profile currently registered in our system. If you wish to delete this profile, please contact a member of Root with the following info:\nid: \`${profile.id}\`\nuser: \`${profile.user_id}\``
            )
            .setColor(Colors.Red);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        await Query.profiles
          .createProfile(
            (interaction.member as GuildMember).displayName,
            interaction.user.id,
            interaction.user.avatarURL() ??
              (interaction.client.user.avatarURL() as string)
          )
          .then((ret) => {
            let data = ret.data as ProfileOutput;
            let embed = new EmbedBuilder()
              .setTitle("Profile Created")
              .setDescription(
                `Registered as ${data.display_name}; access your profile through \`/profile display\`.`
              )
              .setColor(Colors.Green);
            return interaction.reply({ embeds: [embed], ephemeral: true });
          });
        break;
      }

      case "search": {
        let query = interaction.options.getString("name", true);
        let profiles: ProfileOutput[];
        await Query.profiles.getProfileLikeUsername(query).then(async (ret) => {
          if (ret.status == Status.NOTFOUND) {
            return interaction.reply({
              content: "Your search returned no results.",
              ephemeral: true,
            });
          }
          profiles = (ret.data as ProfileOutput[]).slice(0, 25);
          if (profiles.length == 1) {
            let embed = await render(profiles[0]);
            let menu = await Components.Menu(`${profiles[0].user_id}`);
            let likebtn = new ButtonBuilder().setCustomId(
              `like-${profiles[0].user_id}`
            );
            let likerow = new ActionRowBuilder<ButtonBuilder>().addComponents(
              likebtn
            );
            return interaction.reply({
              embeds: [embed],
              components: [menu, likerow],
            });
          }
          let embed = new EmbedBuilder()
            .setTitle("Multiple Results Found")
            .setDescription(
              "Please select the appropriate profile from the options listed below. If your profile isn't show, try a more specific query."
            )
            .setColor(Colors.Indigo);
          let menu = new StringSelectMenuBuilder().setCustomId("searchres");
          for (let profile of profiles) {
            menu.addOptions({
              label: profile.display_name,
              value: profile.user_id,
              description:
                profile.bio.length > 25
                  ? `${profile.bio.slice(0, 25)}...`
                  : `${profile.bio}`,
            });
          }
          let row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
          await interaction.reply({ embeds: [embed], components: [row] });
        });
      }
    }
  },
};
