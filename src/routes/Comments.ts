import { QueryTypes } from "sequelize";
import { db } from "..";
import { DatabaseInsertError } from "../types/Errors";
import { CommentData, Get, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";

/**
 * Comment routing class.
 */
class Comments {
  /**
   * POST operation to upload and sync a new Comment to the comments table.
   * @param targetID The Discord ID snowflake of the destination user.
   * @param authorID The Discord ID snowflake of the authoring user.
   * @param authorTag The Discord Tag of the authoring user. Can be obtained via `interaction.user.tag`.
   * @param message The provided message.
   * @returns Promise containing a Post object, which contains the comment data, and a status code.
   */
  async postComment(
    targetID: string,
    authorID: string,
    authorTag: string,
    message: string
  ): Promise<Post> {
    const timestamp = `${Math.round(new Date().getTime() / 1000)}`;

    await db
      .query(
        `INSERT INTO comments (
        target_id, author_id, author_tag, 
        message, timestamp
      ) 
      VALUES 
        (
          '${targetID}', '${authorID}', '${authorTag}', 
          :message, ${timestamp}
        )
      `,
        {
          replacements: {
            message,
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
        author_id: authorID,
        author_tag: authorTag,
        message,
        timestamp,
      } as CommentData,
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent comments made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the comments as a Comment array, and a status code.
   */
  async retrieveComments(targetID: string): Promise<Get> {
    const retTuple = (await db.query(
      `SELECT * FROM comments WHERE target_id = '${targetID}' ORDER BY id DESC`,
      {
        replacements: {
          targetID,
        },
        type: QueryTypes.SELECT,
      }
    )) as ReturnData[] as CommentData[];

    return {
      data: retTuple,
      status: Status.OK,
    };
  }
}

export default Comments;
