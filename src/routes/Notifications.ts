import { QueryTypes } from "sequelize";
import { cache, db } from "..";
import { DatabaseInsertError } from "../types/Errors";
import { Get, NotificationData, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";
import { Operations, Tables } from "../cache/CacheEnums";
import Cache from "../cache/Cache";

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
    let object: NotificationData = {
      target_id: targetID,
      timestamp,
      text,
      marked_read: 0,
    };

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
      .then(async (ret) => {
        object.id = ret[0];
        await Cache.update(Tables.Notifications, Operations.INSERT, [object]);
      })
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
    const retTuple = (await cache
      .query(
        `SELECT * FROM notifications WHERE target_id = :targetID ORDER BY id DESC`,
        {
          replacements: {
            targetID,
          },
          type: QueryTypes.SELECT,
        }
      )
      .catch(async (err: any) => {
        await db.query(
          `SELECT * FROM notifications WHERE target_id = :targetID ORDER BY id DESC`,
          {
            replacements: {
              targetID,
            },
            type: QueryTypes.SELECT,
          }
        );
      })) as ReturnData[] as NotificationData[];

    return {
      data: retTuple,
      status: Status.OK,
    };
  }

  async cacheSync(operation: Operations, data: NotificationData[]) {
    switch (operation) {
      case Operations.INSERT: {
        for (let notif of data) {
          await cache.query(
            `INSERT INTO notifications (target_id, timestamp, text, marked_read, id)
                 VALUES (:target, :timestamp, :text, :read, :id)`,
            {
              replacements: {
                target: notif.target_id,
                timestamp: notif.timestamp,
                text: notif.text,
                read: notif.marked_read,
                id: notif.id,
              },
              type: QueryTypes.INSERT,
            }
          );
        }
        break;
      }
      case Operations.DELETE: {
        for (let notif of data) {
          await cache.query(
            `DELETE
                                 FROM like_users
                                 WHERE id = :id`,
            {
              replacements: {
                id: notif.id as number,
              },
              type: QueryTypes.DELETE,
            }
          );
        }
        break;
      }
      case Operations.UPDATE: {
        for (let notif of data) {
          await cache.query(
            `UPDATE notifications
                                 SET target_id      = :target,
                                     timestamp      = :timestamp,
                                     text           = :text,
                                     marked_read    = :read
                                 WHERE id = :id`,
            {
              replacements: {
                target: notif.target_id,
                timestamp: notif.timestamp,
                text: notif.text,
                read: notif.marked_read,
                id: notif.id,
              },
              type: QueryTypes.UPDATE,
            }
          );
        }
        break;
      }
    }
  }
}

export default Notifications;
