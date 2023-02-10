import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	ModalSubmitInteraction
} from "discord.js"
import { Comment, LikeUser, Notification, Profile } from "./DatabaseSchemas"

/**
 * A general return definition.
 */

type ReturnData = Comment[] | Notification[] | LikeUser[] | Profile[] | Object

/**
 * Interactions that can be replied or edited to.
 */
type RepliableInteraction =
	| ChatInputCommandInteraction
	| ButtonInteraction
	| ModalSubmitInteraction

export { ReturnData, RepliableInteraction }
