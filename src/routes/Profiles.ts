import * as ProfileService from "../services/api/ProfileService"
import { Get, Patch, Post, ProfileCounter, Status } from "../types/Interfaces"

/**
 * Profiles routing class.
 */
class Profiles {
	async createProfile(
		displayName: string,
		userID: string,
		displayPicture: string
	): Promise<Post> {
		let object = {
			display_name: displayName,
			badge_flags: 0,
			user_id: userID,
			display_picture: displayPicture
		}
		let profile = await ProfileService.create(object)

		return {
			data: profile,
			status: Status.OK
		}
	}

	async getProfileLikeUsername(username: string): Promise<Get> {
		let profiles = await ProfileService.getAll({ display_name_like: username })

		let status = profiles.length === 0 ? Status.NOTFOUND : Status.OK

		return {
			data: profiles,
			status: status
		}
	}

	async getProfile(
		parameters: {
			display_name?: string
			display_name_like?: string
			user_id?: string
		},
		limit?: number
	): Promise<Get> {
		let profiles = await ProfileService.getAll(parameters)
		profiles =
			limit && profiles.length > limit ? profiles.slice(0, limit) : profiles
		if (profiles.length === 0) {
			return {
				data: [],
				status: Status.NOTFOUND
			}
		} else if (profiles.length === 1) {
			return {
				data: profiles[0],
				status: Status.OK
			}
		} else {
			return {
				data: profiles,
				status: Status.OK
			}
		}
	}

	async increment(
		id: number,
		mode: "hits" | "likes" | "rep"
	): Promise<ProfileCounter> {
		let profile = await ProfileService.increment(id, mode)
		let count = 0
		switch (mode) {
			case "hits":
				count = profile.hits
				break
			case "likes":
				count = profile.likes
				break
			case "rep":
				count = profile.rep
				break
		}
		return {
			id: profile.id,
			display_name: profile.display_name,
			count: count
		}
	}

	async addRepCooldown(id: number, timestamp: string): Promise<void> {
		await ProfileService.update(id, { last_thank: timestamp })
	}

	async update(
		filters: {
			display_name?: string
			bio?: string
			display_picture?: string
			notif_on_comments?: boolean
			notif_on_general?: boolean
			notif_on_likes?: boolean
		},
		id: number
	): Promise<Patch> {
		let oldstate = await ProfileService.getById(id)
		let newstate = await ProfileService.update(id, filters)
		return {
			oldData: oldstate,
			newData: newstate,
			status: Status.OK
		}
	}
}

export default Profiles
