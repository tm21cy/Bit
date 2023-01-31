import { GuildMember } from "discord.js"
import normalize from "../services/normalizer"

module.exports = {
	name: "guildMemberUpdate",
	once: false,
	async execute(oldMember: GuildMember, newMember: GuildMember) {
		if (newMember.guild.id !== "924767148738486332") return

		await newMember.fetch()

		if (oldMember.displayName !== newMember.displayName) {
			if (newMember.user.bot) return
			if (!newMember.manageable) return
			let fixedName = await normalize.normalize(newMember.displayName)
			if (fixedName === newMember.displayName) return
			if (fixedName.length === 1 || fixedName.length === 0)
				fixedName = await normalize.randNameStr("Moderated Username ")
			newMember.setNickname(fixedName, "Automatic username clean")
		}
	}
}
