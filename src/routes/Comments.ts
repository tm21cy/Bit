import { QueryTypes } from "sequelize";
import { db } from "../models/Sequelizes";
import { Get, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";
import * as CommentService from "../services/api/CommentService";

/**
 * Comment routing class.
 */
export default class Comments {
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

    let comment = await CommentService.create({
      target_id: targetID,
      author_id: authorID,
      author_tag: authorTag,
      message: message,
      timestamp: timestamp,
    });

    return {
      data: comment,
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent comments made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the comments as a Comment array, and a status code.
   */
  async retrieveComments(targetID: string): Promise<Get> {
    let retTuple = await CommentService.getAll({ target_id: targetID });
    retTuple = retTuple.slice(0, 5);
    return {
      data: retTuple,
      status: Status.OK,
    };
  }
}
