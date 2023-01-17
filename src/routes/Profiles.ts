import { QueryTypes } from "sequelize";
import { cache, db } from "..";
import { Get, Post, ProfileData, Status } from "../types/Interfaces";
import { Profile } from "../types/DatabaseSchemas";
import { Operations, Tables } from "../cache/CacheEnums";
import Cache from "../cache/Cache";

/**
 * Profiles routing class.
 */
class Profiles {
  async createProfile(
    displayName: string,
    userID: string,
    displayPicture: string
  ): Promise<Post> {
    let object: ProfileData = {
      display_name: displayName,
      badge_flags: 0,
      user_id: userID,
      bio: "Hello, world!",
      display_picture: displayPicture,
      hits: 0,
      likes: 0,
      muted: 0,
    };
    await db
      .query(
        `INSERT INTO profiles (display_name, badge_flags, user_id, display_picture, hits, likes, muted)
             VALUES (:displayName, 0, :userID, :displayPicture, 0, 0, 0)
            `,
        {
          replacements: {
            displayName,
            userID,
            displayPicture,
          },
          type: QueryTypes.INSERT,
        }
      )
      .then(async (ret) => {
        object.id = ret[0];
        await Cache.update(Tables.Profiles, Operations.INSERT, [object]);
      });

    return {
      data: {
        displayName,
        badge_flags: 0,
        user_id: userID,
        display_picture: displayPicture,
        hits: 0,
        likes: 0,
        muted: false,
      },
      status: Status.OK,
    };
  }

  async getProfile(
    parameters: {
      display_name?: string;
      badge_flags?: number;
      user_id?: string;
      hits?: {
        filter: "gt" | "gte" | "lt" | "lte" | "nez" | "zero";
        threshold?: number;
      };
      likes?: {
        filter: "gt" | "gte" | "lt" | "lte" | "nez" | "zero";
        threshold?: number;
      };
      muted?: boolean;
    },
    limit?: number
  ): Promise<Get> {
    let params = [];
    let paramKeywords = [];
    let hitskw = "= 0";
    let likeskw = "= 0";
    console.log(typeof parameters.user_id);
    if (parameters.display_name) {
      params.push(parameters.display_name);
      paramKeywords.push("display_name");
    }
    if (parameters.badge_flags) {
      params.push(parameters.badge_flags);
      paramKeywords.push("badge_flags");
    }
    if (parameters.user_id) {
      params.push(parameters.user_id);
      paramKeywords.push("user_id");
    }
    if (parameters.hits) {
      let thresh = parameters.hits.threshold ?? 0;
      parameters.hits.threshold = thresh;
      params.push(parameters.hits);
      paramKeywords.push("hits");
      if (parameters.hits.filter != "zero") {
        switch (parameters.hits.filter) {
          case "gt":
            hitskw = `> ${thresh}`;
            break;
          case "gte":
            hitskw = `>= ${thresh}`;
            break;
          case "lt":
            hitskw = `< ${thresh}`;
            break;
          case "lte":
            hitskw = `<= ${thresh}`;
            break;
          case "nez":
            hitskw = "!= 0";
            break;
        }
      }
    }
    if (parameters.likes) {
      let thresh = parameters.likes.threshold ?? 0;
      parameters.likes.threshold = thresh;
      params.push(parameters.likes);
      paramKeywords.push("likes");
      if (parameters.likes.filter != "zero") {
        switch (parameters.likes.filter) {
          case "gt":
            hitskw = `> ${thresh}`;
            break;
          case "gte":
            hitskw = `>= ${thresh}`;
            break;
          case "lt":
            hitskw = `< ${thresh}`;
            break;
          case "lte":
            hitskw = `<= ${thresh}`;
            break;
          case "nez":
            hitskw = "!= 0";
            break;
        }
      }
    }
    if (parameters.muted) {
      params.push(parameters.muted ? 1 : 0);
      paramKeywords.push("muted");
    }

    let query = `SELECT *
                     FROM profiles`;

    for (let i = 0; i < params.length; i++) {
      if (typeof params[i] != "object") {
        if (i == 0)
          query = `${query} WHERE ${paramKeywords[i]} = ${
            typeof params[i] == "string" ? `${params[i]}` : params[i]
          }`;
        else
          query = `${query} AND ${paramKeywords[i]} = ${
            typeof params[i] == "string" ? `${params[i]}` : params[i]
          }`;
      } else {
        if (i == 0)
          query = `${query} WHERE ${paramKeywords[i]} ${
            paramKeywords[i] == "hits" ? hitskw : likeskw
          }`;
        else
          query = `${query} AND ${paramKeywords[i]} ${
            paramKeywords[i] == "hits" ? hitskw : likeskw
          }`;
      }
    }

    limit ? limit : (limit = -1);

    let ret = (await cache
      .query(query, {
        type: QueryTypes.SELECT,
      })
      .catch(async (err: any) => {
        await db.query(query, {
          type: QueryTypes.SELECT,
        });
      })) as Profile[];

    if (limit > 0) {
      return {
        data: ret.slice(0, limit - 1) as ProfileData[],
        status: Status.OK,
      };
    } else if (limit == 1) {
      return {
        data: ret[0] as ProfileData,
        status: Status.PARTIAL,
      };
    } else {
      return {
        data: ret as ProfileData[],
        status: Status.OK,
      };
    }
  }

  async cacheSync(operation: Operations, data: ProfileData[]) {
    switch (operation) {
      case Operations.INSERT: {
        for (let user of data) {
          await cache.query(
            `INSERT INTO profiles (display_name, badge_flags, user_id, bio, display_picture, hits, likes, id, muted)
                 VALUES (:display, :badges, :user, :bio, :pfp, :hits, :likes, :id, :muted)`,
            {
              replacements: {
                display: user.display_name,
                badges: user.badge_flags,
                user: user.user_id,
                bio: user.bio,
                pfp: user.display_picture,
                hits: user.hits,
                likes: user.likes,
                id: user.id,
                muted: user.muted,
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
                                 FROM profiles
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
            `UPDATE profiles
                                 SET display_name = :display,
                                     badge_flags  = :badges,
                                     user_id      = :user,
                                     bio          = :bio,
                                     display_picture = :pfp,
                                     hits         = :hits,
                                     likes        = :likes,
                                     muted        = :muted
                                 WHERE id = :id`,
            {
              replacements: {
                display: user.display_name,
                badges: user.badge_flags,
                user: user.user_id,
                bio: user.bio,
                pfp: user.display_picture,
                hits: user.hits,
                likes: user.likes,
                id: user.id,
                muted: user.muted,
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

export default Profiles;
