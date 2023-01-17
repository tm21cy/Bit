import { cache, db } from "../index";
import {
  CommentData,
  Data,
  HelperData,
  LikeUsersData,
  NotificationData,
  ProfileData,
} from "../types/Interfaces";
import { Stopwatch } from "@sapphire/stopwatch";
import { QueryTypes } from "sequelize";
import { Operations, Tables } from "./CacheEnums";
import Query from "../routes/Query";

export default class Cache {
  /**
   * Syncs the current state of every table in the MySQL DB.
   * Receives a number of reads equal to the number of tables from the MySQL DB, and returns *n* writes per table to the SQLite DB.
   * @returns Stringified time result.
   */
  static async sync(): Promise<string> {
    let sw = new Stopwatch();
    sw.start();
    const comments = (await db.query(`SELECT * FROM comments`, {
      type: QueryTypes.SELECT,
    })) as CommentData[];
    if (comments.length > 0) {
      for (let comment of comments) {
        await cache.query(
          `INSERT INTO comments (target_id, author_id, author_tag, message, timestamp, id) VALUES (:target, :author, :tag, :message, :timestamp, :id)`,
          {
            replacements: {
              target: comment.target_id,
              author: comment.author_id,
              tag: comment.author_tag,
              message: comment.message,
              timestamp: comment.timestamp,
              id: comment.id as number,
            },
          }
        );
      }
    }

    const helpers = (await db.query(`SELECT * FROM helpers`, {
      type: QueryTypes.SELECT,
    })) as HelperData[];
    if (helpers.length > 0) {
      for (let helper of helpers) {
        await cache.query(
          `INSERT INTO helpers (user_id, lang, id) VALUES (:user, :lang, :id)`,
          {
            replacements: {
              user: helper.user_id,
              lang: helper.lang as string,
              id: helper.id as number,
            },
          }
        );
      }
    }

    const likeUsers = (await db.query(`SELECT * FROM like_users`, {
      type: QueryTypes.SELECT,
    })) as LikeUsersData[];
    if (likeUsers.length > 0) {
      for (let user of likeUsers) {
        await cache.query(
          `INSERT INTO like_users (target_id, author_id, id) VALUES (:target, :author, :id)`,
          {
            replacements: {
              target: user.target_id,
              author: user.author_id,
              id: user.id as number,
            },
          }
        );
      }
    }

    const notifications = (await db.query(`SELECT * FROM notifications`, {
      type: QueryTypes.SELECT,
    })) as NotificationData[];
    if (notifications.length > 0) {
      for (let notif of notifications) {
        await cache.query(
          `INSERT INTO notifications (target_id, timestamp, text, marked_read, id) VALUES (:target, :timestamp, :text, :read, :id)`,
          {
            replacements: {
              target: notif.target_id,
              timestamp: notif.timestamp,
              text: notif.text,
              read: notif.marked_read,
              id: notif.id as number,
            },
          }
        );
      }
    }

    const profiles = (await db.query(`SELECT * FROM profiles`, {
      type: QueryTypes.SELECT,
    })) as ProfileData[];
    if (profiles.length > 0) {
      for (let profile of profiles) {
        await cache.query(
          `INSERT INTO profiles (display_name, badge_flags, user_id, bio, display_picture, hits, likes, id, muted) VALUES (:name, :flags, :user, :bio, :pfp, :hits, :likes, :id, :muted)`,
          {
            replacements: {
              name: profile.display_name,
              flags: profile.badge_flags,
              user: profile.user_id,
              bio: profile.bio,
              pfp: profile.display_picture,
              hits: profile.hits,
              likes: profile.likes,
              id: profile.id,
              muted: profile.muted,
            },
          }
        );
      }
    }
    return sw.stop().toString();
  }

  static async update(table: Tables, operation: Operations, data: Data[]) {
    switch (table) {
      case Tables.Comments: {
        await Query.comments.cacheSync(operation, data as CommentData[]);
        break;
      }
      case Tables.Helpers: {
        await Query.helpers.cacheSync(operation, data as HelperData[]);
        break;
      }
      case Tables.LikeUsers: {
        await Query.likes.cacheSync(operation, data as LikeUsersData[]);
        break;
      }
      case Tables.Notifications: {
        await Query.notifications.cacheSync(
          operation,
          data as NotificationData[]
        );
        break;
      }
      case Tables.Profiles: {
        await Query.profiles.cacheSync(operation, data as ProfileData[]);
        break;
      }
    }
  }

  static async reset() {
    await cache.query(`DELETE FROM comments`);
    await cache.query(`DELETE FROM helpers`);
    await cache.query(`DELETE FROM like_users`);
    await cache.query(`DELETE FROM notifications`);
    await cache.query(`DELETE FROM profiles`);
  }
}
