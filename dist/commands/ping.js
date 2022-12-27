"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stopwatch_1 = require("@sapphire/stopwatch");
const discord_js_1 = require("discord.js");
const time_utilities_1 = require("@sapphire/time-utilities");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the websocket latency."),
    async execute(interaction) {
        await interaction.reply("📡 Ping 1");
        const stopwatch = new stopwatch_1.Stopwatch().start();
        await interaction.editReply("🛰️ Ping 2");
        stopwatch.stop();
        const client = interaction.client;
        const wsPing = interaction.client.ws.ping;
        const uptime = new time_utilities_1.DurationFormatter().format(client.uptime);
        interaction.editReply(`⏱️ Message Latency: ${stopwatch.toString()}\n🛰️ Websocket Latency: ${wsPing}ms\n🔌 Uptime: ${uptime}`);
    }
};
