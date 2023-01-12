import Profiles from "./Profiles";
import Comments from "./Comments";
import LikeUsers from "./LikeUsers";
import Notifications from "./Notifications";

export default class Query {
  static profiles = new Profiles();
  static comments = new Comments();
  static likes = new LikeUsers();
  static notifications = new Notifications();
}
