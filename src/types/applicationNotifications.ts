import { stripIndents } from "common-tags"

const staffNotification = (status: "accepted" | "denied", reason: string | null, usertag: string) => {
	let additionalInfo
	if (status === "accepted") {
		additionalInfo = "We look forward to working with you!\n\nYou will receive your staff role shortly and be pinged in the staff channel."
	} else if (status === "denied") {
		additionalInfo = reason === null ? "You may reapply in the future when staff applications are open." : `Reason for denial: ${reason}`
	}
	return stripIndents`
		Dear ${usertag},

        We are ${status === "accepted" ? "happy" : "sorry"} to notify you that your staff application has been ${status}. ${additionalInfo}
        
		Bit *on behalf of* root, the ownership team.
	`
}

const proficientNotification = (status: "accepted" | "denied", reason: string | null, usertag: string) => {
	let additionalInfo
	if (status === "accepted") {
		additionalInfo = "You will receive your proficient role shortly."
	} else if (status === "denied") {
		additionalInfo = reason === null ? "You may reapply in the future when proficient applications are open." : `Reason for denial: ${reason}`
	}
	return stripIndents`
		Dear ${usertag},

		We are ${status === "accepted" ? "happy" : "sorry"} to notify you that your proficient application has been ${status}. ${additionalInfo}
		
		Bit *on behalf of* root, the ownership team.
	`
}

const fluentNotification = (status: "accepted" | "denied", reason: string | null, usertag: string) => {
	let additionalInfo
	if (status === "accepted") {
		additionalInfo = "You will receive your fluent role shortly."
	} else if (status === "denied") {
		additionalInfo = reason === null ? "You may reapply in the future when fluent applications are open." : `Reason for denial: ${reason}`
	}
	return stripIndents`
		Dear ${usertag},

		We are ${status === "accepted" ? "happy" : "sorry"} to notify you that your fluent application has been ${status}. ${additionalInfo}
		
		Bit *on behalf of* root, the ownership team.
	`
}

const feedbackPalNotificationAccepted = (usertag: string) => {
	return stripIndents`
		Dear ${usertag},

		This message is to let you know that you have become a Feedback Pal. Feedback pals get access to early content which they will rate and give suggestions on.
		
		The official feedback pal channel is <#1016810380464488550>.
		
		This goes without saying but please do not leak anything as it will probably result in you getting removed.
		
		Bit *on behalf of* root, the ownership team.
	`
}

function generateApplicationMessage(type: "staff" | "proficient" | "fluent", status: "accepted" | "denied", reason: string | null, usertag: string) {
	switch (type) {
		case "staff":
			return staffNotification(status, reason, usertag)
		case "proficient":
			return proficientNotification(status, reason, usertag)
		case "fluent":
			return fluentNotification(status, reason, usertag)
	}
}

export { generateApplicationMessage, feedbackPalNotificationAccepted }