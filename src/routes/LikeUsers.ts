import { QueryTypes } from "sequelize";
import { db } from "../models/Sequelizes";
import { DatabaseInsertError } from "../types/Errors";
import { Get, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";
import * as LikeUserService from "../services/api/LikeUserService";
import * as ProfileService from "../services/api/ProfileService";

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
    let object = {
      author_id: authorID,
      target_id: targetID,
    };

    let like = await LikeUserService.create(object);

    return {
      data: like,
      status: Status.OK,
    };
  }

  /**
   * GET request that returns a truncated list of the 5 most recent comments made targeting the user found with `targetID`.
   * @param targetID The Discord ID snowflake of the targeted user.
   * @returns Promise containing a Get object, which contains the data about each like, and a status code.
   */
  async retrieveLikes(targetID: string): Promise<Get> {
    let likeUsers = await LikeUserService.getAll({ target_id: targetID });
    likeUsers = likeUsers.slice(0, 5);

    return {
      data: likeUsers,
      status: Status.OK,
    };
  }

  async countLikes(targetID: string): Promise<Get> {
    let likes = 0;
    await ProfileService.getAll({ user_id: targetID }).then((ret) => {
      likes = ret[0].likes;
    });

    return {
      data: {
        targetID,
        count: likes,
      },
      status: Status.OK,
    };
  }
}

export default LikeUsers;
