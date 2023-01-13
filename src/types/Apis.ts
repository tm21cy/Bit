interface DangerousDiscordBadges {
	blacklisted?: boolean;
	whitelisted?: boolean;
	admin?: boolean;
	raid_bot?: boolean;
	scam_bot?: boolean;
}

interface BlacklistResponse {
	frisky: {
		blacklisted: boolean
		reason: string
	}
	blacklister: {
		blacklisted: boolean
		reason: string
		evidence: string
	}
	dangerousDiscord: {
		reports: number
		badges: DangerousDiscordBadges,
		votes: {
			upvotes: number
			downvotes: number
		}
		flags: {
			spammer: boolean
		},
	}
	dangerous: boolean
}

interface FriskyDetailedResponse {
	status: number
	data: [
		{
			id: string
			username: string
			discriminator: string
			added: string
			updated: string
			add_reason: string
			bot: number // 0 = false, 1 = true
		}
	],
	requestId: string
}

type FriskyFormattedDetailedResponse = {
	id: string
	username: string
	discriminator: string
	added: string
	updated: string
	add_reason: string
	bot: number
}[]
	

export { DangerousDiscordBadges, BlacklistResponse, FriskyDetailedResponse, FriskyFormattedDetailedResponse }