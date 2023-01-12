import { ReturnData } from "./Types";

enum Status {
  OK = 200,
  ERROR = 500,
  NOTFOUND = 404,
  PARTIAL = 206,
}

interface CommentData {
  target_id: string;
  author_id: string;
  author_tag: string;
  message: string;
  timestamp: string;
  id?: number;
}

interface LikeUsersData {
  target_id: string;
  author_id: string;
  id?: number;
}

interface NotificationData {
  target_id: string;
  timestamp: string;
  text: string;
  marked_read: boolean;
  id?: number;
}

interface ProfileData {
  display_name: string;
  badge_flags: number;
  user_id: string;
  bio: string;
  display_picture: string;
  hits: number;
  likes: number;
  muted: boolean;
  id?: number;
}

interface Post {
  data: Data;
  status: Status;
}

interface Get {
  data: Data;
  status: Status;
}

interface Patch {
  oldData: Data;
  newData: Data;
  status: Status;
}

interface Delete {
  oldData: Data;
  status: Status;
}

type Data =
  | CommentData
  | LikeUsersData
  | NotificationData
  | ProfileData
  | ReturnData;

export {
  Post,
  Get,
  Patch,
  Delete,
  CommentData,
  LikeUsersData,
  NotificationData,
  ProfileData,
  Status,
};
