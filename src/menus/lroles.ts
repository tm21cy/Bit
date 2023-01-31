import { StringSelectMenuInteraction } from "discord.js"
import Query from "../routes/Query"
import { HelperCollection } from "../types/Interfaces"

module.exports = {
	name: "lroles",
	async execute(interaction: StringSelectMenuInteraction) {
		const uid = interaction.customId.split("-")[1]
		await Query.helpers.removeRoles(uid, ...interaction.values).then((data) => {
			let ret = data.changes as HelperCollection
			return interaction.reply({
				content: `**Removed roles:** ${
					ret.langs?.length && ret.langs.length > 0
						? ret.langs?.join(", ")
						: "None"
				}`,
				ephemeral: true
			})
		})
	}
}
