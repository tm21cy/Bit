"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("418")
        .setDescription("I'm a teapot."),
    async execute(interaction) {
        return interaction.reply({ content: "I'm a teapot." });
    }
};
