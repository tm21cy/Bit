/**
 * Structure of comments left on a user's profile.
 */
interface Comment {
	target_id: string
	author_id: string
	author_tag: string
	message: string
	timestamp: number
	id: number
}

/**
 * Structure of a 'like' interaction from one user to another.
 */
interface LikeUser {
	target_id: string
	author_id: string
	id: number
}

/**
 * Structure of a notification message sent to a user's private inbox.
 */
interface Notification {
	target_id: string
	timestamp: number
	text: string
	marked_read: boolean
	id: number
}

/**
 * Structure of a user profile.
 */
interface Profile {
	display_name: string
	badge_flags: number
	user_id: string
	bio: string
	display_picture: string
	hits: number
	likes: number
	id: number
}

interface Helper {
	user_id: string
	lang: string[]
	id?: number
}

export { Comment, LikeUser, Notification, Profile, Helper }
