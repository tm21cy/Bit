"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../services/logger");
const uuid_1 = require("uuid");
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction)
                .catch((error) => {
                const errorId = (0, uuid_1.v4)();
                logger_1.log.error(error, errorId);
                interaction.deferred
                    ? interaction.editReply({
                        content: `There was an error while executing this command. Error ID: ${errorId}`,
                        embeds: [],
                        files: []
                    })
                    : interaction.reply({
                        content: `There was an error while executing this command. Error ID: ${errorId}`,
                        embeds: [],
                        files: []
                    });
            });
        }
        catch (error) {
            const errorId = (0, uuid_1.v4)();
            logger_1.log.error(error, errorId);
            interaction.deferred
                ? interaction.editReply({
                    content: `There was an error while executing this command. Error ID: ${errorId}`,
                    embeds: [],
                    files: []
                })
                : interaction.reply({
                    content: `There was an error while executing this command. Error ID: ${errorId}`,
                    embeds: [],
                    files: []
                });
        }
    },
};
