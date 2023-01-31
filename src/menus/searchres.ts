import { StringSelectMenuInteraction } from "discord.js"
import { ProfileOutput } from "../models/Profile"
import Query from "../routes/Query"
import Components from "../utilities/profiles/components"
import ProfileBuilder from "../utilities/profiles/ProfileBuilder"

module.exports = {
	name: "searchres",
	async execute(interaction: StringSelectMenuInteraction) {
		await interaction.deferUpdate()
		let user = interaction.values[0]
		let profile = (await Query.profiles.getProfile({ user_id: user }))
			.data as ProfileOutput
		await interaction.editReply({
			embeds: [await ProfileBuilder.renderHome(profile)],
			components: [await Components.Menu(user)]
		})
	}
}
