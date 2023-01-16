import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  discordSort,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { languages, platforms } from "../types/help-roles";
import Colors from "../enums/colors";
import Query from "../routes/Query";
import { HelperCollection, HelperData } from "../types/Interfaces";
import * as emojis from "../utilities/emojis.json";
import _, { difference } from "lodash";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("helper-roles")
    .setDescription("Manage your helper roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join-or-leave")
        .setDescription(
          "Join or leave a helper role for the languages/platforms/tech you know."
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Lists all the roles you can join or are currently in.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ping")
        .setDescription("Ping a helper role.")
        .addStringOption((option) =>
          option
            .setName("role")
            .setDescription("The role to ping.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let subcommand = interaction.options.getSubcommand();
    console.log(subcommand);
    let uid = interaction.user.id;
    switch (subcommand) {
      case "join-or-leave": {
        let joinBtn = new ButtonBuilder()
          .setCustomId(`join-${uid}`)
          .setStyle(ButtonStyle.Success)
          .setLabel("Join Roles");
        let leaveBtn = new ButtonBuilder()
          .setCustomId(`leave-${uid}`)
          .setStyle(ButtonStyle.Danger)
          .setLabel("Leave Roles");
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          joinBtn,
          leaveBtn
        );
        let embed = new EmbedBuilder()
          .setTitle("Helper Role Membership Panel")
          .setDescription(
            "Using the buttons below to open interfaces, join and leave helper roles by interacting with the select menu."
          )
          .setColor(Colors.Indigo);

        await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        break;
      }
      case "list": {
        let langroles = (
          (await Query.helpers.retrieveRoles(uid, "langs")).data as HelperData
        ).langs as string[];
        let platroles = (
          (await Query.helpers.retrieveRoles(uid, "platforms"))
            .data as HelperData
        ).langs as string[];
        let nonLangRoles = difference(languages, langroles);
        let nonPlatRoles = difference(platforms, platroles);
        let displayName = (interaction.member as GuildMember).displayName;

        let embed = new EmbedBuilder()
          .setTitle(`${displayName}'s Helper Roles`)
          .addFields(
            {
              name: "Languages",
              value: `${
                langroles.length > 0 ? emojis.check : ""
              } ${langroles.join(`\n${emojis.check} `)}\n${
                emojis.cancel
              } ${nonLangRoles.join(`\n${emojis.cancel} `)}`,
            },
            {
              name: "Platforms / Libraries",
              value: `${
                platroles.length > 0 ? emojis.check : ""
              } ${platroles.join(`\n${emojis.check} `)}\n${
                emojis.cancel
              } ${nonPlatRoles.join(`\n${emojis.cancel} `)}`,
            }
          );

        await interaction.reply({ embeds: [embed] });
        break;
      }
      case "ping": {
        let lang = interaction.options.getString("role", true);
        let users = (
          (await Query.helpers.getUsers(lang)).data as HelperCollection
        ).users;
        if (users.length == 0) {
          await interaction.reply({
            content: "There are no helpers for that role.",
          });
          return;
        }
        let userArray = [];
        let needle = false;
        const ITERATIONS = 5;
        let iteration = 0;
        if (users.length >= 5) {
          while (!needle) {
            let shuffleUsers = _.shuffle(users).slice(0, 5);
            for (let user of shuffleUsers) {
              let discordUser = await interaction.guild?.members.resolve(user);
              if (!discordUser) continue;
              if (!discordUser.presence?.status) {
                console.log(
                  `${discordUser.user.username} is offline or invisible.`
                );
              } else userArray.push(user);
            }
            if (userArray.length >= 3) {
              needle = true;
            }
            iteration++;
            if (iteration >= 5) break;
          }
          let sliceidx = userArray.length >= 3 ? 3 : userArray.length;
          userArray = _.shuffle(userArray).slice(0, sliceidx);
        } else userArray = users;
        let content = "";
        for (let user of userArray) {
          content += `<@${user}> `;
        }
        await interaction.reply({
          content: `**${lang} Helpers:** ${content}`,
        });
      }
    }
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const helpRoles = [...languages, ...platforms];
    // A maximum of 25 options can be returned
    const filtered = helpRoles
      .filter((helpRole) => helpRole.startsWith(focusedValue))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((helpRole) => ({ name: helpRole, value: helpRole }))
    );
  },
};
