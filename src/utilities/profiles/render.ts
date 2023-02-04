import { ColorResolvable, EmbedBuilder } from "discord.js"
import Colors from "../../enums/colors"
import { ProfileOutput } from "../../models/Profile"
import Query from "../../routes/Query"
import Badges from "./badges"

export default async function render(profile: ProfileOutput) {
	// Profile data destructure
	let _display_name = profile.display_name
	let badge_flags = profile.badge_flags
	let user_id = profile.user_id
	let bio = profile.bio
	let display_picture = profile.display_picture ?? process.env.CLIENT_PFP
	let hits = profile.hits
	let likes = profile.likes
	let rep = profile.rep
	let _id = profile.id
	let _muted = profile.muted

	// Preliminary data parsing
	let _embedColor = "#5856d6"
	let badges = Badges.getBadgeEmojis(badge_flags)
	let bret = Badges.getBadges(badge_flags)
	let badgeNames = bret.names
	let _badgeVals = bret.indices
	let _comments = await Query.comments.retrieveComments(user_id)
	let chunks: string[] = []

	for (let i = 0; i < badges.length; i += 5) {
		chunks.push(
			badges
				.slice(i, i + 5)
				.toString()
				.replaceAll(",", " ")
		)
	}

	const embed = new EmbedBuilder()
	embed.setTitle(`${profile.display_name}`)
	embed.setThumbnail(display_picture)
	embed.addFields([
		{
			name: " ",
			value: `${bio}`
		},
		{
			name: " ",
			value: `<:thumbs_up:1062436702444081234> ${likes}\t<:views:1062436699889737819> ${hits}\t<:empathize:1067278826905796768> ${rep}`,
			inline: true
		}
	])
	embed.setDescription(`${chunks[0] === "" ? " " : chunks.join("\n")}`)

	embed.setColor(getColor(badgeNames))

	return embed
}

export function getColor(badges: string[]): ColorResolvable {
	switch (true) {
		case badges.includes("Root"):
			return Colors.Indigo
		case badges.includes("SeniorMod"):
			return Colors.Red
		case badges.includes("Mod"):
			return Colors.Yellow
		case badges.includes("Proficient"):
			return Colors.Purple
		case badges.includes("Fluent"):
			return Colors.Teal
		case badges.includes("Active"):
			return Colors.Active
		case badges.includes("Regular"):
			return Colors.Green
		default:
			return Colors.Blue
	}
}
