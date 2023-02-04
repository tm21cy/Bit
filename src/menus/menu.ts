import { ActionRowBuilder, StringSelectMenuInteraction } from "discord.js"
import { ProfileOutput } from "../models/Profile"
import Query from "../routes/Query"
import Badges from "../utilities/profiles/badges"
import ProfileBuilder from "../utilities/profiles/ProfileBuilder"

module.exports = {
	name: "menu",
	async execute(interaction: StringSelectMenuInteraction) {
		await interaction.deferUpdate()
		let uid = interaction.customId.split("-")[1]
		// rome-ignore lint/suspicious/noExplicitAny: the menu may have any type of component
		let menu = new ActionRowBuilder<any>().addComponents(interaction.component)
		let profile = (await Query.profiles.getProfile({ user_id: uid }, 1))
			.data as ProfileOutput
		let _badges = Badges.getBadges(profile.badge_flags)
		switch (interaction.values[0]) {
			case "badges": {
				await interaction.editReply({
					embeds: [await ProfileBuilder.renderBadges(profile)],
					components: [menu]
				})
				break
			}
			case "comments": {
				let components = await ProfileBuilder.renderComments(
					profile,
					interaction
				)
				await interaction.editReply({
					embeds: [components[0]],
					components: [components[1], components[2]]
				})
				break
			}
			case "home": {
				await interaction.editReply({
					embeds: [await ProfileBuilder.renderHome(profile)],
					components: [menu]
				})
				break
			}
		}
	}
}
