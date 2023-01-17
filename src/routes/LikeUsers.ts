import { QueryTypes } from "sequelize";
import { cache, db } from "..";
import { DatabaseInsertError } from "../types/Errors";
import { Get, LikeUsersData, Post, Status } from "../types/Interfaces";
import { ReturnData } from "../types/Types";
import { Operations, Tables } from "../cache/CacheEnums";
import Cache from "../cache/Cache";

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
    let object: LikeUsersData = {
      author_id: authorID,
      target_id: targetID,
    };

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
      .then(async (ret) => {
        object.id = ret[0];
        await Cache.update(Tables.LikeUsers, Operations.INSERT, [object]);
      })
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
    const retTuple = (await cache
      .query(
        `SELECT * FROM like_users WHERE target_id = :targetID ORDER BY id DESC`,
        {
          replacements: {
            targetID,
          },
          type: QueryTypes.SELECT,
        }
      )
      .catch(async (err: any) => {
        await db.query(
          `SELECT * FROM like_users WHERE target_id = :targetID ORDER BY id DESC`,
          {
            replacements: {
              targetID,
            },
            type: QueryTypes.SELECT,
          }
        );
      })) as ReturnData[];

    return {
      data: retTuple,
      status: Status.OK,
    };
  }

  async countLikes(targetID: string): Promise<Get> {
    const val = (
      (await cache
        .query(`SELECT COUNT(id) FROM like_users WHERE target_id = :targetID`, {
          replacements: {
            targetID,
          },
          type: QueryTypes.SELECT,
        })
        .catch(async (err: any) => {
          await db.query(
            `SELECT COUNT(id) FROM like_users WHERE target_id = :targetID`,
            {
              replacements: {
                targetID,
              },
              type: QueryTypes.SELECT,
            }
          );
        })) as LikeUsersData[]
    )[0];

    return {
      data: {
        targetID,
        count: val,
      },
      status: Status.OK,
    };
  }

  async cacheSync(operation: Operations, data: LikeUsersData[]) {
    switch (operation) {
      case Operations.INSERT: {
        for (let user of data) {
          await cache.query(
            `INSERT INTO like_users (target_id, author_id, id)
                 VALUES (:target, :author, :id)`,
            {
              replacements: {
                target: user.target_id,
                author: user.author_id,
                id: user.id,
              },
              type: QueryTypes.INSERT,
            }
          );
        }
        break;
      }
      case Operations.DELETE: {
        for (let user of data) {
          await cache.query(
            `DELETE
                                 FROM like_users
                                 WHERE id = :id`,
            {
              replacements: {
                id: user.id as number,
              },
              type: QueryTypes.DELETE,
            }
          );
        }
        break;
      }
      case Operations.UPDATE: {
        for (let user of data) {
          await cache.query(
            `UPDATE like_users
                                 SET target_id  = :target,
                                     author_id  = :author
                                 WHERE id = :id`,
            {
              replacements: {
                target: user.target_id,
                author: user.author_id,
                id: user.id,
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

export default LikeUsers;
