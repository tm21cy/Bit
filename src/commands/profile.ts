import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
import { NotificationOutput } from "../models/Notification";

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
    )
    .addSubcommandGroup((c) =>
      c
        .setName("update")
        .setDescription("Commands for updating your profile.")
        .addSubcommand((s) =>
          s
            .setName("name")
            .setDescription("Updates your profile display name.")
            .addStringOption((i) =>
              i.setName("input").setDescription("The new value of your name.")
            )
        )
        .addSubcommand((s) =>
          s
            .setName("bio")
            .setDescription("Updates your profile bio.")
            .addStringOption((s) =>
              s.setName("input").setDescription("The new value of your bio.")
            )
        )
        .addSubcommand((s) =>
          s
            .setName("picture")
            .setDescription(
              "Updates your profile picture to your current Discord picture."
            )
        )
        .addSubcommand((s) =>
          s
            .setName("notif-settings")
            .setDescription("Updates your notification settings.")
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    let group = interaction.options.getSubcommandGroup();

    if (!group) {
      switch (sub) {
        case "display": {
          let profile = (
            await Query.profiles.getProfile({
              user_id: `${interaction.user.id}`,
            })
          ).data as ProfileOutput;
          let embed = await render(profile);
          let menu = await Components.Menu(`${interaction.user.id}`);

          let notifications = (
            await Query.notifications.retrieveUnread(interaction.user.id)
          ).data as NotificationOutput[];

          await interaction.reply({ embeds: [embed], components: [menu] });
          if (notifications.length > 0) {
            interaction.channel?.send({
              content: `<@${interaction.user.id}>, you have **${notifications.length} unread notifications!** Make sure to run \`/notifications\` to read them.`,
            });
          }
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
          await Query.profiles
            .getProfileLikeUsername(query)
            .then(async (ret) => {
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
                let likebtn = new ButtonBuilder()
                  .setCustomId(`like-${profiles[0].user_id}`)
                  .setLabel("Like")
                  .setStyle(ButtonStyle.Primary);
                let likerow =
                  new ActionRowBuilder<ButtonBuilder>().addComponents(likebtn);
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
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                  menu
                );
              await interaction.reply({ embeds: [embed], components: [row] });
            });
        }
      }
    } else if (group == "update") {
      let profile = (
        await Query.profiles.getProfile({ user_id: interaction.user.id }, 1)
      ).data as ProfileOutput;
      switch (sub) {
        case "name": {
          let name = interaction.options.getString("input", true);
          await Query.profiles
            .update({ display_name: name }, profile.id)
            .then(async (res) => {
              let newstate = res.newData as ProfileOutput;
              return await interaction.reply({
                content: `Changes deployed:\n\nOld name: ${profile.display_name}\nNew name: ${newstate.display_name}`,
                ephemeral: true,
              });
            });
          break;
        }
        case "bio": {
          let bio = interaction.options.getString("input", true);
          await Query.profiles.update({ bio }, profile.id).then(async () => {
            return await interaction.reply({
              content: `Changes to your bio have been deployed.`,
              ephemeral: true,
            });
          });
          break;
        }
        case "picture": {
          let picture = await interaction.user.avatarURL();
          if (!picture)
            return await interaction.reply({
              content:
                "You do not have an avatar that I can use to update your profile picture.",
              ephemeral: true,
            });
          await Query.profiles
            .update({ display_picture: picture }, profile.id)
            .then(async () => {
              return await interaction.reply({
                content: `Changes to your profile picture have been deployed.`,
                ephemeral: true,
              });
            });
          break;
        }
        case "notif-settings": {
          let commentsbtn = new ButtonBuilder()
            .setStyle(
              profile.notif_on_comments
                ? ButtonStyle.Success
                : ButtonStyle.Danger
            )
            .setLabel(`Comments - ${profile.notif_on_comments ? "On" : "Off"}`)
            .setCustomId(`notif-comments-${interaction.user.id}`);
          let generalbtn = new ButtonBuilder()
            .setStyle(
              profile.notif_on_general
                ? ButtonStyle.Success
                : ButtonStyle.Danger
            )
            .setLabel(`General - ${profile.notif_on_general ? "On" : "Off"}`)
            .setCustomId(`notif-general-${interaction.user.id}`);
          let likesbtn = new ButtonBuilder()
            .setStyle(
              profile.notif_on_likes ? ButtonStyle.Success : ButtonStyle.Danger
            )
            .setLabel(`Likes - ${profile.notif_on_likes ? "On" : "Off"}`)
            .setCustomId(`notif-likes-${interaction.user.id}`);

          let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            commentsbtn,
            generalbtn,
            likesbtn
          );

          let embed = new EmbedBuilder()
            .setTitle("Toggle Notification Settings")
            .setDescription(
              "Use the buttons below to toggle to the state of certain notification triggers.\n\nComments - Sends you a DM Notification when someone comments on your profile.\nGeneral - Sends you a DM Notification on events like rep additions, bot updates, or other general purpose activities.\nLikes - Sends you a DM Notification when a user likes your profile.\n\nNOTE: These settings do not affect the built-in notification inbox - only DM notifications."
            )
            .setColor(Colors.Indigo);
          let menu = new StringSelectMenuBuilder()
              .setCustomId("searchres");
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
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(menu);
          await interaction.reply({ embeds: [embed], components: [row] });
        });
      }
    }
  },
};
