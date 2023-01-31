import Comment from "./Comment"
import Helper from "./Helper"
import LikeUser from "./LikeUser"
import Notification from "./Notification"
import Profile from "./Profile"

const init = async (bool: boolean) => {
	Comment.sync({ force: bool })
	Helper.sync({ force: bool })
	LikeUser.sync({ force: bool })
	Notification.sync({ force: bool })
	Profile.sync({ force: bool })
}

export default init
