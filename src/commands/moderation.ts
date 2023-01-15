import { codeBlock } from "@sapphire/utilities";
import { stripIndents } from "common-tags";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
  Guild,
  GuildBan,
  Interaction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
  User,
} from "discord.js";
import followRedirect from "follow-redirect-url";
import { client } from "..";
import Sentry from "../services/sentry";
import Util from "../utilities/general";
import re2 from "re2";
import {
  FriskyDetailedResponse,
  FriskyFormattedDetailedResponse,
} from "../types/Apis";
import Colors from "../enums/colors";
import axios from "axios";
import { log } from "../services/logger";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Moderation commands and utilities.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("follow-url")
        .setDescription("Follow a URL to see where it redirects to.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The URL to follow.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("scan")
        .setDescription("Scan the server member's names or accounts.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of scan to perform.")
            .setRequired(true)
            .addChoices(
              { name: "Usernames", value: "usernames" },
              { name: "Accounts", value: "accounts" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The query to search for.")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("output-options")
            .setDescription("Additional output options.")
            .setRequired(false)
            .addChoices({ name: "Only IDs", value: "ids" })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("whois")
        .setDescription("Get information about a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to get information about. Supports IDs.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pause-invites")
        .setDescription(
          "Run this command to stop all further joins and pause invites."
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("join-alert")
        .setDescription(
          "Manages the user join alert system which posts a log when the specified user joins the server."
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Add a user to the join alert list.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription(
                  "The user to add to the join alert list. Supports IDs."
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Remove a user from the join alert list.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription(
                  "The user to remove from the join alert list. Supports IDs."
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription("List all users on the join alert list.")
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    /* Follow URL */
    let url = interaction.options.getString("url");
    let reply = "";

    /* Scan */
    const type = interaction.options.getString("type");
    const query = interaction.options.getString("query");
    const outputOptions = interaction.options.getString("output-options");
    let members;
    let file;
    let count = 0;

    /* Whois */
    const user = interaction.options.getUser("user");

    /* Pause invites */
    let replyEmbed: EmbedBuilder;
    let confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary)
    );
    const confirmEmbed = new EmbedBuilder()
      .setTitle("Confirmation Required")
      .setDescription(
        `Are you sure you would like to enable undetected raid mode?`
      )
      .setColor(Colors.Red);

    /* Join Alert */
    const joinAlertUser = interaction.options.getUser("user");

    switch (subcommand) {
      case "follow-url":
        if (!url)
          return interaction.reply({ content: "You must provide a URL." });
        followRedirect
          .startFollowing(url)
          .then(
            (
              res: [
                {
                  url: string;
                  redirect: boolean;
                  status: number;
                  redirectUrl: string;
                }
              ]
            ) => {
              reply = `**${res.length} Redirects:**\n`;
              for (const followedUrl of res) {
                reply += `${followedUrl.status} | ${followedUrl.url}\n`;
              }
            }
          )
          .catch((err: Error) => {
            reply = `**Error:** ${codeBlock("js", err)}`;
          })
          .finally(() => {
            interaction.reply({ content: reply });
          });
        break;
      case "scan":
        if (!type)
          return interaction.reply({ content: "You must provide a type." });
        switch (type) {
          case "usernames":
            if (!query)
              return interaction.reply({
                content: "You must provide a query.",
              });
            await interaction.deferReply();
            members = await interaction.guild?.members.fetch();
            for (const member of members.values()) {
              if (member.displayName.match(new re2(query))) {
                count++;
                if (outputOptions === "ids") {
                  reply += `${member.id}\n`;
                } else {
                  reply += `${member.displayName} (${member.id})\n`;
                }
              }
            }
            file = new AttachmentBuilder(Buffer.from(reply), {
              name: "usernames.txt",
            });
            if (count === 0) {
              return interaction.editReply({ content: "No results found." });
            }
            interaction.editReply({
              content: `Found ${count} results.`,
              files: [file],
            });
            break;
          case "accounts":
            members = await interaction.guild?.members.fetch();
            await interaction.reply({
              content: `Scanning ${members.size} members...`,
            });
            let friskyScammers:
              | FriskyDetailedResponse
              | FriskyFormattedDetailedResponse
              | Error = await Sentry.getBlacklistedUsers();
            if (friskyScammers instanceof Error) {
              interaction.editReply({
                content: `An error occurred while scanning: ${codeBlock(
                  "js",
                  friskyScammers
                )}`,
              });
              return;
            }
            friskyScammers = friskyScammers.data;
            // A standard for-loop with length caching is the fastest loop in JavaScript. See https://stackoverflow.com/a/7252102
            const length = friskyScammers.length;
            for (let i = 0; i < length; i++) {
              const friskyScammer = friskyScammers[i];
              if (friskyScammer.bot) continue;
              const member = members.get(friskyScammer.id);
              if (member) {
                count++;
                if (outputOptions === "ids") {
                  reply += `${member.id}\n`;
                } else {
                  reply += `${member.displayName} (${member.id})\n`;
                }
              }
            }
            file = new AttachmentBuilder(Buffer.from(reply), {
              name: "accounts.txt",
            });
            if (count === 0) {
              return interaction.editReply({ content: "No results found." });
            }
            interaction.editReply({
              content: `Found ${count} results.`,
              files: [file],
            });
            break;
        }
        break;
      case "whois":
        if (!user)
          return interaction.reply({ content: "You must provide a user." });
        interaction.reply({
          content: "",
          embeds: [await infoUser(user.id)],
          components: [],
        });
        break;
      case "pause-invites":
        interaction.reply({
          embeds: [confirmEmbed],
          components: [confirmRow],
        });

        const filter = (i: Interaction) => i.user.id === interaction.user.id;
        const collector = interaction.channel?.createMessageComponentCollector({
          filter,
          time: 15000,
        });

        collector?.on("end", async (x, reason) => {
          if (reason === "time") {
            interaction.editReply({
              content: "Timed out.",
              embeds: [],
              components: [],
            });
            return;
          }
        });

        collector?.on("collect", async (i: ButtonInteraction) => {
          if (i.customId === "cancel") {
            interaction.editReply({
              content: "Cancelled.",
              embeds: [],
              components: [],
            });
            return;
          }
          undetectedRaid(interaction, i);
        });

        function undetectedRaid(
          interaction: ChatInputCommandInteraction,
          i: ButtonInteraction
        ) {
          i.update({
            content: "Processing...",
            embeds: [],
            components: [],
          });

          const guild = interaction.guild!;
          let pausedInvites = false;

          pauseInvites(interaction.user, guild)
            .then((res) => {
              pausedInvites = res;
            })
            .catch(() => {
              pausedInvites = false;
            });

          const alertsChannel = guild.channels.cache.get(
            "933381980488335390"
          ) as TextChannel;
          const noticeEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} has enabled raid mode.`)
            .setDescription(
              stripIndents`
									**Auto-actions taken:**
										- ${
                      pausedInvites
                        ? "Invites paused, no accounts will be able to join."
                        : "Failed to pause invites."
                    }
								`
            )
            .setColor(Colors.Red);

          alertsChannel.send({
            content: `<@&976626926422753310> <@&928410176678154250>`, // Emergency staff ping, raid alert ping
            embeds: [noticeEmbed],
          });

          replyEmbed = new EmbedBuilder()
            .setTitle("Raid mode enabled.")
            .setDescription(
              stripIndents`
									**Severity:** Low
									**Auto-actions taken:**
										- ${
                      pausedInvites
                        ? "Invites paused, no accounts will be able to join."
                        : "Failed to pause invites."
                    }

									**Please follow the below instructions:**
								`
            )
            .addFields([
              {
                name: "1. Identify when the raid started.",
                value:
                  "Look at the ID join logs and try to find the time the raid accounts started joining.",
              },
              {
                name: "2. Get the IDs of the raid accounts",
                value:
                  "Drag-select all IDs from the first raid account to the last raid account. Then copy to clipboard",
              },
              {
                name: "3. Ping a root member",
                value: "Send the IDs to a root member.",
              },
              {
                name: "4. Wait for root member to take action",
                value: "Root members will take action on the raid accounts.",
              },
            ])
            .setColor(Colors.Red);

          i.editReply({
            embeds: [replyEmbed],
            components: [],
          });
        }
        break;
    }

    switch (subcommandGroup) {
      case "join-alert":
        switch (subcommand) {
          case "add":
            // TODO: Dependency on join-alerts database
            interaction.reply({
              content: "This command is currently disabled.",
              ephemeral: true,
            });
            break;
          case "remove":
            // TODO: Dependency on join-alerts database
            interaction.reply({
              content: "This command is currently disabled.",
              ephemeral: true,
            });
            break;
          case "list":
            // TODO: Dependency on join-alerts database
            interaction.reply({
              content: "This command is currently disabled.",
              ephemeral: true,
            });
            break;
        }
    }

    async function infoUser(id: string) {
      const user = await client.users.fetch(id);
      const inGuild = await interaction.guild?.members
        .fetch(id)
        .catch(() => false);
      const banned = await interaction.guild?.bans
        .fetch(id)
        .then((ban: GuildBan) => {
          return `Yes. Reason: ${ban.reason ?? "No reason provided."}`;
        })
        .catch(() => "No.");

      const flagsStrings =
        user.flags
          ?.toArray()
          .map((flag) =>
            flag
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
          ) ?? [];
      if ((user.flags?.bitfield as number) & (1 << 20))
        flagsStrings.push("Spammer");
      const blacklistInfo = await Sentry.isBlacklistedUser(user.id);

      const infoEmbed = new EmbedBuilder()
        .setTitle(`Global User Info - ${user.tag}`)
        .setDescription(
          stripIndents`
					**ID:** ${user.id}
					**Username:** ${user.username}
					**Discriminator:** ${user.discriminator}
					**Bot:** ${user.bot ? "Yes" : "No"}
					**Creation Date:** ${Util.generateTimestamp("F", user.createdAt, true)}
					**Discord System Component:** ${user.system ? "Yes" : "No"}
					**Flags:** ${user.flags?.bitfield} (${flagsStrings} )
					**In Guild:** ${inGuild ? "Yes" : "No"}
					**Banned:** ${banned}
				`
        )
        .setThumbnail(user.avatarURL({ size: 4096 }) ?? user.defaultAvatarURL)
        .addFields([
          {
            name: `Background Check ${blacklistInfo.dangerous ? "" : "- OK"}`,
            value: `${Sentry.formatBlacklistResponse(blacklistInfo)}`,
          },
        ])
        .setColor(blacklistInfo.dangerous ? Colors.Red : Colors.Green);

      if (user.bannerURL()) {
        infoEmbed.setImage(user.bannerURL({ size: 4096 }) as string);
        infoEmbed.addFields([
          {
            name: "Banner",
            value: "** **",
          },
        ]);
      }

      return infoEmbed;
    }

    async function pauseInvites(executioner: User, Guild: Guild) {
      let features = Guild.features;
      features.push("INVITES_DISABLED");
      const headers = {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      };
      const data = {
        features: features,
        "X-Audit-Log-Reason": `Undetected raid raid mode enabled by ${executioner.tag} (${executioner.id})}.`,
      };
      return await axios
        .patch(`https://discord.com/api/v10/guilds/${Guild.id}`, data, {
          headers: headers,
        })
        .then((res) => {
          return res.data.features.includes("INVITES_DISABLED");
        })
        .catch((err) => {
          log.error(err, "Failed to pause invites.");
          return false;
        });
    }
  },
};
