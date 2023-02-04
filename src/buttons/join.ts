import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	SelectMenuOptionBuilder,
	StringSelectMenuBuilder
} from "discord.js"
import Colors from "../enums/colors"
import { languages } from "../types/help-roles"

module.exports = {
	name: "join",
	async execute(interaction: ButtonInteraction) {
		let cid = interaction.customId
		const userID = cid.split("-")[1]
		let opts: SelectMenuOptionBuilder[] = []
		for (let lang of languages) {
			opts.push(new SelectMenuOptionBuilder().setLabel(lang).setValue(lang))
		}
		let menu = new StringSelectMenuBuilder()
			.addOptions(opts)
			.setCustomId(`jroles-${userID}`)
			.setPlaceholder("Select languages to add.")
			.setMaxValues(opts.length)

		let homeBtn = new ButtonBuilder()
			.setCustomId(`home-${userID}`)
			.setLabel("Home")
			.setStyle(ButtonStyle.Primary)

		let platformsBtn = new ButtonBuilder()
			.setCustomId(`pforms-${userID}`)
			.setLabel("Platforms")
			.setStyle(ButtonStyle.Primary)

		let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			menu
		)

		let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			homeBtn,
			platformsBtn
		)

		let embed =
			interaction.message.embeds[0] ??
			new EmbedBuilder()
				.setTitle("Select Language Roles")
				.setColor(Colors.Indigo)

		await interaction.update({
			embeds: [embed],
			components: [row, row2]
		})
	}
}
