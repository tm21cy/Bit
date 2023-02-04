import { ButtonInteraction } from "discord.js"
import { ProfileOutput } from "../models/Profile"
import Query from "../routes/Query"

module.exports = {
	name: "home",
	async execute(interaction: ButtonInteraction) {
		let type = interaction.customId.split("-")[1]
		let _components = interaction.message.components
		let _embed = interaction.message.embeds[0]
		let _profile = (
			await Query.profiles.getProfile({ user_id: interaction.user.id }, 1)
		).data as ProfileOutput
		switch (type) {
		} // TODO
	}
}
