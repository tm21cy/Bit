import Profiles from "./Profiles";
import Comments from "./Comments";
import LikeUsers from "./LikeUsers";
import Notifications from "./Notifications";
import HelpRoles from "./HelpRoles";

/**
 * Query class that contains all the query classes.
 */
export default class Query {
  static profiles = new Profiles();
  static comments = new Comments();
  static likes = new LikeUsers();
  static notifications = new Notifications();
  static helpers = new HelpRoles();
}
