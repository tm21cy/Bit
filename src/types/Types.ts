import { Comment, LikeUser, Notification, Profile } from "./DatabaseSchemas";

/**
 * A general return definition.
 */

type ReturnData = Comment[] | Notification[] | LikeUser[] | Profile[] | Object;

export { ReturnData };
