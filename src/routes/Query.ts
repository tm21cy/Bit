import Profiles from "./Profiles";
import Comments from "./Comments";
import LikeUsers from "./LikeUsers";
import Notifications from "./Notifications";
import HelpRoles from "./HelpRoles";
import { Status } from "../types/Interfaces";
import { db } from "../models/Sequelizes";
import { stat } from "fs";
import JoinAlerts from "./JoinAlerts";

/**
 * Query class that contains all the query classes.
 */
export default class Query {
  static profiles = new Profiles();
  static comments = new Comments();
  static likes = new LikeUsers();
  static notifications = new Notifications();
  static helpers = new HelpRoles();
  static joinAlerts = new JoinAlerts();

  static async status(): Promise<Status> {
    let status: Status = Status.ERROR;
    await db
      .authenticate()
      .then(() => {
        status = Status.OK;
      })
      .catch(() => {
        status = Status.ERROR;
      });

    return status;
  }
}
