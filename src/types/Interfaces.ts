import { ReturnData } from "./Types";
import { Optional } from "sequelize";
import { CommentOutput } from "../models/Comment";
import { HelperOutput } from "../models/Helper";
import { LikeUserOutput } from "../models/LikeUser";
import { NotificationOutput } from "../models/Notification";
import { ProfileOutput } from "../models/Profile";
import { JoinAlertOutput } from "../models/JoinAlert";

enum Status {
  OK = 200,
  ERROR = 500,
  NOTFOUND = 404,
  PARTIAL = 206,
}

interface HelperCollection {
  users: string[];
  langs?: string[];
  lang?: string;
}

interface HelperRoleEdit {
  langs?: string[];
}

interface LangData {
  lang: string;
}

interface ProfileCounter {
  id: number;
  display_name: string;
  count: number;
}

interface Post {
  data: Data;
  status: Status;
  fails?: any[];
}

interface Get {
  data: Data;
  status: Status;
  fails?: any[];
}

interface Patch {
  oldData: Data;
  newData: Data;
  status: Status;
  fails?: any[];
}

interface Delete {
  oldData: Data;
  changes: HelperRoleEdit | object;
  status: Status;
  fails?: any[];
}

type Data =
  | CommentOutput
  | HelperOutput
  | LikeUserOutput
  | NotificationOutput
  | ProfileOutput
  | HelperCollection
  | ReturnData
  | JoinAlertOutput;

interface BadgeData {
  names: string[];
  indices: number[];
}

export {
  Post,
  Get,
  Patch,
  Delete,
  HelperCollection,
  LangData,
  Status,
  Data,
  BadgeData,
  ProfileCounter,
};
