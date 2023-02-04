import { db } from "../models/Sequelizes"
import { Status } from "../types/Interfaces"
import Comments from "./Comments"
import HelpRoles from "./HelpRoles"
import JoinAlerts from "./JoinAlerts"
import LikeUsers from "./LikeUsers"
import Notifications from "./Notifications"
import Profiles from "./Profiles"

/**
 * Query class that contains all the query classes.
 */
export default class Query {
	static profiles = new Profiles()
	static comments = new Comments()
	static likes = new LikeUsers()
	static notifications = new Notifications()
	static helpers = new HelpRoles()
	static joinAlerts = new JoinAlerts()

	static async status(): Promise<Status> {
		let status: Status = Status.ERROR
		await db
			.authenticate()
			.then(() => {
				status = Status.OK
			})
			.catch(() => {
				status = Status.ERROR
			})

		return status
	}
}
