import { Presence } from "discord.js"

module.exports = {
	name: "presenceUpdate",
	once: false,
	execute(oldPresence: Presence | null, newPresence: Presence) {
		if (newPresence.guild?.id !== "924767148738486332") return
		if (!newPresence.member?.roles.cache.has("924773450441170954")) return // Staff role
		if (oldPresence && oldPresence.status === newPresence.status) return

		const onDutyRoleId = "976626926422753310"
		const currentPresence = newPresence.member?.presence

		if (newPresence.status === "offline") {
			async function removeOnDuty() {
				if (currentPresence?.status !== "offline") return
				if (!newPresence.member?.roles.cache.has(onDutyRoleId)) return
				await newPresence.member?.roles.remove(
					onDutyRoleId,
					"User went offline. Removing on-duty role."
				)
			}
			// 5 minutes
			setTimeout(removeOnDuty, 5 * 60 * 1000)
		} else {
			async function addOnDuty() {
				if (currentPresence?.status === "offline") return
				if (newPresence.member?.roles.cache.has(onDutyRoleId)) return
				await newPresence.member?.roles.add(
					onDutyRoleId,
					"User went online. Adding on-duty role."
				)
			}

			//5 minutes
			setTimeout(addOnDuty, 5 * 60 * 1000)
		}
	}
}
