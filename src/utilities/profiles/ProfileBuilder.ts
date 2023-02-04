import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	StringSelectMenuInteraction
} from "discord.js"
import { CommentOutput } from "../../models/Comment"
import { ProfileOutput } from "../../models/Profile"
import Query from "../../routes/Query"
import Badges from "./badges"
import render, { getColor } from "./render"

export default class ProfileBuilder {
	static async renderHome(profile: ProfileOutput): Promise<EmbedBuilder> {
		return await render(profile)
	}

	static async renderBadges(profile: ProfileOutput): Promise<EmbedBuilder> {
		let badges = Badges.getBadges(profile.badge_flags)
		let description = Badges.getDescriptions(profile.badge_flags).join("\n")
		if (description.length === 0) description = "This user has no badges."
		return new EmbedBuilder()
			.setTitle(`${profile.display_name}'s Badges`)
			.setColor(getColor(badges.names))
			.setDescription(`${description}`)
	}

	static async renderComments(
		profile: ProfileOutput,
		interaction: StringSelectMenuInteraction
	): Promise<
		// rome-ignore lint/suspicious/noExplicitAny: the menu may have any type of component
		[EmbedBuilder, ActionRowBuilder<any>, ActionRowBuilder<ButtonBuilder>]
	> {
		let badges = Badges.getBadges(profile.badge_flags)
		let comments = (await Query.comments.retrieveComments(profile.user_id))
			.data as CommentOutput[]
		let description: string[] = []
		if (comments.length === 0) description = ["No comments."]
		else {
			for (let comment of comments) {
				description.push(
					`**${comment.author_tag}** - ${comment.message} (<t:${comment.timestamp}:f>)`
				)
			}
		}
		let embed = new EmbedBuilder()
			.setTitle(`${profile.display_name}'s Comments`)
			.setColor(getColor(badges.names))
			.setDescription(`${description.join("\n")}`)

		let commentBtn = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setLabel("Add Comment")
			.setCustomId(`comment-${profile.user_id}`)
		let row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(commentBtn)
		// rome-ignore lint/suspicious/noExplicitAny: the menu may have any type of component
		let rowExisting = new ActionRowBuilder<any>().addComponents(
			interaction.component
		)

		return [embed, rowExisting, row1]
	}

	static async renderPortfolio(profile: ProfileOutput): Promise<EmbedBuilder> {
		let badges = Badges.getBadges(profile.badge_flags)
		return new EmbedBuilder()
			.setTitle(`${profile.display_name}'s Portfolio`)
			.setDescription("Coming soon!")
			.setColor(getColor(badges.names))
	}
}
