import { QueryTypes } from "sequelize";
import { db } from "../models/Sequelizes";
import { DatabaseInsertError } from "../types/Errors";
import { Get, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";
import * as NotificationService from "../services/api/NotificationService";

/**
 * Notifications routing class.
 */
class Notifications {
  /**
   * POST operation to upload and sync a new Notification to the notifications table.
   * @param targetID The Discord ID snowflake of the destination user.
   * @param text The text of the notification being synced.
   * @returns Promise containing a Post object, which contains the notification data, and a status code.
   */
  async postNotification(targetID: string, text: string): Promise<Post> {
    const timestamp = `${Math.round(new Date().getTime() / 1000)}`;
    let object = {
      target_id: targetID,
      timestamp,
      text,
    };

    let notification = await NotificationService.create(object);

    return {
      data: notification,
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent notifications made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the data about each notification, and a status code.
   */
  async retrieveNotifications(targetID: string): Promise<Get> {
    const retTuple = (
      await NotificationService.getAll({ target_id: targetID })
    ).slice(0, 5);
    return {
      data: retTuple,
      status: Status.OK,
    };
  }
}

export default Notifications;
