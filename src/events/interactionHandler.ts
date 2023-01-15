import {
  ApplicationCommandType,
  ComponentType,
  Interaction,
  InteractionType,
} from "discord.js";
import { log } from "../services/logger";
import { v4 as uuidv4 } from "uuid";
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        switch (interaction.commandType) {
          case ApplicationCommandType.ChatInput:
            const command = interaction.client.commands.get(
              interaction.commandName
            );

            if (!command) return;

            try {
              await command.execute(interaction).catch((error: unknown) => {
                const errorId = uuidv4();
                log.error(error, errorId);
                interaction.deferred
                  ? interaction.editReply({
                      content: `There was an error while executing this command. Error ID: ${errorId}`,
                      embeds: [],
                      files: [],
                    })
                  : interaction.reply({
                      content: `There was an error while executing this command. Error ID: ${errorId}`,
                      embeds: [],
                      files: [],
                    });
              });
            } catch (error) {
              const errorId = uuidv4();
              log.error(error, errorId);
              interaction.deferred
                ? interaction.editReply({
                    content: `There was an error while executing this command. Error ID: ${errorId}`,
                    embeds: [],
                    files: [],
                  })
                : interaction.reply({
                    content: `There was an error while executing this command. Error ID: ${errorId}`,
                    embeds: [],
                    files: [],
                  });
            }
            break;
        }
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        const command = interaction.client.commands.get(
          interaction.commandName
        );

        if (!command) return;

        try {
          await command.autocomplete(interaction);
        } catch (error) {
          log.error(error);
        }
        break;

      case InteractionType.MessageComponent:
        const prefix = interaction.customId.split("-")[0];
        switch (interaction.componentType) {
          case ComponentType.Button:
            let btn = interaction.client.buttons.get(`${prefix}`);
            if (!btn) return;
            await btn.execute(interaction);
        }
    }
  },
};
