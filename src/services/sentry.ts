import axios from "axios"
import { stripIndents } from "common-tags"
import { join } from "path"
import { JoinAlertOutput } from "../models/JoinAlert"
import Query from "../routes/Query"
import { BlacklistResponse, DangerousDiscordBadges, FriskyDetailedResponse } from "../types/Apis"
import { Status } from "../types/Interfaces"
import { log } from "./logger"

const friskyAPIURL = "https://api.extrafrisky.dev/api/v1"
const blacklisterAPIURL = "https://api.blacklister.xyz"
const dangerousDiscordAPIURL = "https://dangercord.com/api/v1"

/**
 * Gets advanced information about a target like a invite via an API.
 * @class
 */
class Sentry {
	/**
	 * Checks if a user is blacklisted against all known blacklists.
	 * @param {string} userId The user id to check.
	 * @returns {BlacklistResponse} The responses from the APIs.
	 */
	public static async isBlacklistedUser(guildId: string, userId: string): Promise<BlacklistResponse> {

		let friskyBlacklisted: boolean | null = false
		let friskyBlacklistedReason = ""

		let blacklisterBlacklisted = false
		let blacklisterBlacklistedReason = ""
		let blacklisterBlacklistedEvidence = ""

		let dangerousDiscordReports: string | number = 0
		let dangerousDiscordBadges: DangerousDiscordBadges = {}
		let dangerousDiscordVotes = {
			upvotes: 0,
			downvotes: 0
		}
		let dangerousDiscordFlags = {
			spammer: false
		}
		let joinAlert = {
			blacklisted: false,
			reason: "",
			moderator_id: ""
		}

		// ExtraFrisky

		await axios.get(`${friskyAPIURL}/scammers/detailed/${userId}`, {
			headers: {
				"User-Agent": `Bit - Private Discord Bot - Owner ID ${process.env.DEV_ID_1}`,
				"Authorization": `${process.env.FRISKY_API_KEY}`
			}
		})
			.then((res) => {
				switch (res.status) {
					case 204:
						friskyBlacklisted = false
						break
					case 200:
						friskyBlacklisted = true
						friskyBlacklistedReason = res.data.user.add_reason
						break
					default:
						friskyBlacklisted = null
						friskyBlacklistedReason = `API Error: ${res.status} ${res.statusText}`
						break
				}
			})
			.catch((err) => {
				log.error(err, "Error while checking if user is blacklisted on ExtraFrisky.")
				friskyBlacklisted = null
				friskyBlacklistedReason = `API Error: ${err}`
			})

		// Blacklister

		await axios.get(`${blacklisterAPIURL}/${userId}`, {
			headers: {
				"User-Agent": `Bit - Private Discord Bot - Owner ID ${process.env.DEV_ID_1}`,
				"Authorization": `${process.env.BLACKLISTER_API_KEY}`
			}
		})
			.then((res) => {
				if (res.status !== 200) {
					blacklisterBlacklisted = false
					blacklisterBlacklistedReason = `API Error: ${res.status} ${res.statusText}`
					blacklisterBlacklistedEvidence = ""
				}

				if (res.data.blacklisted) {
					blacklisterBlacklisted = true
					blacklisterBlacklistedReason = res.data.reason
					blacklisterBlacklistedEvidence = res.data.evidence
				} else {
					blacklisterBlacklisted = false
					blacklisterBlacklistedReason = ""
					blacklisterBlacklistedEvidence = ""
				}
			})
			.catch((err) => {
				log.error(err, "Error while checking if user is blacklisted on Blacklister.")
				blacklisterBlacklisted = false
				blacklisterBlacklistedReason = `API Error: ${err}`
				blacklisterBlacklistedEvidence = ""
			})

		// DangerousDiscord

		await axios.get(`${dangerousDiscordAPIURL}/user/${userId}`, {
			headers: {
				"User-Agent": `Bit - Private Discord Bot - Owner ID ${process.env.DEV_ID_1}`,
				"Authorization": `Bearer ${process.env.DANGEROUS_DISCORD_API_KEY}`
			}
		})
			.then((res) => {
				if (res.status !== 200) {
					dangerousDiscordReports = 0
					dangerousDiscordBadges = {}
					dangerousDiscordVotes = {
						upvotes: 0,
						downvotes: 0
					}
					dangerousDiscordFlags = {
						spammer: false
					}
				}

				dangerousDiscordReports = res.data.reports
				dangerousDiscordBadges = res.data.badges
				dangerousDiscordVotes = res.data.votes
				dangerousDiscordFlags = (res.data.flags || { spammer: false })
			})
			.catch((err) => {
				log.error(err, "Error while checking if user is blacklisted on DangerousDiscord.")
				dangerousDiscordReports = `API Error: ${err}`
				dangerousDiscordBadges = {}
				dangerousDiscordVotes = {
					upvotes: 0,
					downvotes: 0
				}
				dangerousDiscordFlags = {
					spammer: false
				}
			})

		if (blacklisterBlacklistedEvidence === ("https://capy-cdn.xyz/no-evidence.png" || "https://evidence.blacklister.xyz/no-evidence.png")) {
			blacklisterBlacklistedEvidence = "No evidence provided."
		}

		// Join Alert Check
		await Query.joinAlerts.isUserJoinAlert(guildId, userId)
			.then((res) => {
				if (res.status === Status.NOTFOUND) {
					return
				} else if (res.status === Status.ERROR) {
					log.error(res, "Error while checking if user is blacklisted on JoinAlert.")
					joinAlert = {
						blacklisted: false,
						reason: `API Error: ${res.fails}`,
						moderator_id: ""
					}
				}

				joinAlert = {
					blacklisted: true,
					reason: (res.data as JoinAlertOutput).reason,
					moderator_id: (res.data as JoinAlertOutput).moderator_id
				}
			})


		const dangerousDiscordBadBadges = Object.assign({}, dangerousDiscordBadges)
		dangerousDiscordBadBadges.whitelisted = undefined
		let dangerous = false

		if (friskyBlacklisted || blacklisterBlacklisted || dangerousDiscordReports > 0 || Object.keys(dangerousDiscordBadBadges).length > 0 || dangerousDiscordFlags.spammer || joinAlert.blacklisted) {
			dangerous = true
		}

		return {
			frisky: {
				blacklisted: friskyBlacklisted,
				reason: friskyBlacklistedReason
			},
			blacklister: {
				blacklisted: blacklisterBlacklisted,
				reason: blacklisterBlacklistedReason,
				evidence: blacklisterBlacklistedEvidence
			},
			dangerousDiscord: {
				reports: dangerousDiscordReports,
				badges: dangerousDiscordBadges,
				votes: {
					upvotes: dangerousDiscordVotes.upvotes,
					downvotes: dangerousDiscordVotes.downvotes
				},
				flags: dangerousDiscordFlags
			},
			joinAlert: joinAlert,
			dangerous: dangerous
		}
	}

	/**
	 * Formats the blacklist response into a string.
	 * @param {BlacklistResponse} blacklistResponse The response from the APIs.
	 * @returns {string} The formatted blacklist response.
	 */
	public static formatBlacklistResponse(blacklistResponse: BlacklistResponse): string {
		const checkEmoji = "<:check:1043294381588877445>"
		const warnEmoji = "<:red_shield:1043294200529166386>"

		let friskyString = ""
		let blacklisterString = ""
		let dangerousDiscordString = ""
		let dangerousDiscordBadgesString = ""
		let joinAlertString = ""

		switch (blacklistResponse.frisky.blacklisted) {
			case true:
				friskyString = stripIndents`
					${warnEmoji} **ExtraFrisky**
					> **Reason:** ${blacklistResponse.frisky.reason}
				`
				break
			case false:
				friskyString = `${checkEmoji} **ExtraFrisky** OK`
				break
		}

		switch (blacklistResponse.blacklister.blacklisted) {
			case true:
				blacklisterString = stripIndents`
				${warnEmoji} **Blacklister**
				> **Reason:** ${blacklistResponse.blacklister.reason}
				> **Evidence:** ${blacklistResponse.blacklister.evidence}
			`
				break
			case false:
				blacklisterString = `${checkEmoji} **Blacklister** OK`
		}

		for (const badge in blacklistResponse.dangerousDiscord.badges) {
			switch (badge) {
				case "blacklisted":
					dangerousDiscordBadgesString += "<:blacklisted:1004497537002110976> Blacklisted,"
					break
				case "whitelisted":
					dangerousDiscordBadgesString += "<:whitelisted:1004497202246336603> Whitelisted,"
					break
				case "raid_bot":
					dangerousDiscordBadgesString += "<:raidbot:1004497197863288892> Raid Bot,"
					break
				case "scam_bot":
					dangerousDiscordBadgesString += "<:scambot:1004497195447361636> Scam Bot,"
					break
				default:
					dangerousDiscordBadgesString += "No badges."
			}
		}

		const votes = `<:upvote:1004497193283109114> ${blacklistResponse.dangerousDiscord.votes.upvotes || "0"
			} <:downvote:1004497191307583508> ${blacklistResponse.dangerousDiscord.votes.downvotes || "0"
			}`

		const flags =
			blacklistResponse.dangerousDiscord.flags?.spammer
				? "<:spammer:1004497199863967794> Spammer"
				: "No flags."

		const dangerousDiscordEmoji = blacklistResponse.dangerous ? warnEmoji : checkEmoji

		dangerousDiscordString += stripIndents`
				${dangerousDiscordEmoji} **DangerousDiscord**
				> **Reports:** ${blacklistResponse.dangerousDiscord.reports}
				> **Badges:** ${dangerousDiscordBadgesString || "No badges."}
				> **Votes:** ${votes}
				> **Flags:** ${flags}
			`

		const joinAlertEmoji = blacklistResponse.joinAlert.blacklisted ? warnEmoji : checkEmoji

		switch (blacklistResponse.joinAlert.blacklisted) {
			case true:
			joinAlertString += stripIndents`
				${joinAlertEmoji} **Join Alert**
				> **Reason:** ${blacklistResponse.joinAlert.reason}
				> **Moderator:** <@${blacklistResponse.joinAlert.moderator_id}>
			`
			break
			case false:
				joinAlertString = `${joinAlertEmoji} **Join Alert** OK`
				break
		}

		return stripIndents`
				${friskyString}
				${blacklisterString}
				${dangerousDiscordString}
				${joinAlertString}
			`
	}

	/**
	 * Returns a list of blacklisted users
	 */
	public static async getBlacklistedUsers(): Promise<FriskyDetailedResponse | Error> {
		const headers = {
			"Content-Type": "application/json",
			Authorization: `${process.env.FRISKY_API_KEY}`
		}

		return await axios.get(`${friskyAPIURL}/scammers/detailed`, { headers })
			.then((response) => {
				return response.data as FriskyDetailedResponse
			})
			.catch((error) => {
				log.error(error)
				return error as Error
			})
	}
}

export default Sentry