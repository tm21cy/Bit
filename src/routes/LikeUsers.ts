import { QueryTypes } from "sequelize";
import { db } from "..";
import { DatabaseInsertError } from "../types/Errors";
import { Get, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";

/**
 * Like users routing class.
 */
class LikeUsers {
  /**
   * POST operation to upload and sync a new LikeUser interaction to the like_users table.
   * @param targetID The Discord ID snowflake of the destination user.
   * @param authorID The Discord ID snowflake of the authoring user.
   * @returns Promise containing a Post object, which contains the like data, and a status code.
   */
  async postLike(targetID: string, authorID: string): Promise<Post> {
    const timestamp = `${Math.round(new Date().getTime() / 1000)}`;

    await db
      .query(
        `INSERT INTO like_users (
        target_id, author_id
      ) 
      VALUES 
        (
          '${targetID}', '${authorID}'
        )
      `,
        {
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
        targetID,
        authorID,
        timestamp,
      },
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent comments made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the data about each like, and a status code.
   */
  async retrieveLikes(targetID: string): Promise<Get> {
    const retTuple = (await db.query(
      `SELECT * FROM like_users WHERE target_id = :targetID ORDER BY id DESC`,
      {
        replacements: {
          targetID,
        },
        type: QueryTypes.SELECT,
      }
    )) as ReturnData[];

    return {
      data: retTuple,
      status: Status.OK,
    };
  }

  async countLikes(targetID: string): Promise<Get> {
    const val = (
      await db.query(
        `SELECT COUNT(id) FROM like_users WHERE target_id = :targetID`,
        {
          replacements: {
            targetID,
          },
          type: QueryTypes.SELECT,
        }
      )
    )[0];

    return {
      data: {
        targetID,
        count: val,
      },
      status: Status.OK,
    };
  }
}

export default LikeUsers;
