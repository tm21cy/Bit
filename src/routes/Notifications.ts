import { QueryTypes } from "sequelize";
import { db } from "..";
import { DatabaseInsertError } from "../types/Errors";
import { Get, NotificationData, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";

/**
 * Comment routing class.
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

    await db
      .query(
        `INSERT INTO notifications (
        target_id, timestamp, text, marked_read
      ) 
      VALUES 
        (
          '${targetID}', '${timestamp}', :text, 0
        )
      `,
        {
          replacements: {
            text,
          },
          type: QueryTypes.INSERT,
        }
      )
      .catch((err: Error) => {
        throw new DatabaseInsertError(
          `Error while inserting new Comments entry: ${err.message}`
        );
      });

    return {
      data: {
        target_id: targetID,
        timestamp,
        text,
        marked_read: false,
      } as NotificationData,
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent notifications made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the data about each notification, and a status code.
   */
  async retrieveNotifications(targetID: string): Promise<Get> {
    const retTuple = (await db.query(
      `SELECT * FROM notifications WHERE target_id = :targetID ORDER BY id DESC`,
      {
        replacements: {
          targetID,
        },
        type: QueryTypes.SELECT,
      }
    )) as ReturnData[] as NotificationData[];

    return {
      data: retTuple,
      status: Status.OK,
    };
  }
}

export default Notifications;
