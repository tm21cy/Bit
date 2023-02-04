import * as JoinAlertService from "../services/api/JoinAlertService"
import { Delete, Get, Post, Status } from "../types/Interfaces"

/**
 * Join Alert routing class.
 */
class JoinAlerts {
	async addUserJoinAlert(
		params: {
			guild_id: string
			target_id: string
			moderator_id: string
		},
		reason?: string
	): Promise<Post> {
		let postReason = reason ?? "No reason provided."
		let res = await JoinAlertService.create({
			...params,
			reason: postReason
		})

		return {
			data: res,
			status: Status.OK
		}
	}

	async removeUserJoinAlert(
		guild_id: string,
		target_id: string
	): Promise<Delete> {
		let user = (await JoinAlertService.getAll({ guild_id, target_id }))[0]
		await JoinAlertService.deleteById(user.id)
		return {
			oldData: user,
			changes: {},
			status: Status.OK
		}
	}

	async isUserJoinAlert(guild_id: string, target_id: string): Promise<Get> {
		let user = await JoinAlertService.getAll({
			guild_id,
			target_id
		})
		if (user.length === 0) {
			return {
				data: [],
				status: Status.NOTFOUND
			}
		} else {
			return {
				data: user[0],
				status: Status.OK
			}
		}
	}

	async retrieveUserJoinAlerts(guild_id: string): Promise<Get> {
		let users = await JoinAlertService.getAll({ guild_id })
		return {
			data: users,
			status: Status.OK
		}
	}
}

export default JoinAlerts
