import { QueryTypes } from "sequelize";
import { db } from "..";
import { Get, Post, ProfileData, Status } from "../types/Interfaces";
import { Profile } from "../types/DatabaseSchemas";

/**
 * Profiles routing class.
 */
class Profiles {
  async createProfile(
    displayName: string,
    userID: string,
    displayPicture: string
  ): Promise<Post> {
    await db.query(
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
    );

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

    let ret = (await db.query(query, {
      type: QueryTypes.SELECT,
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
}

export default Profiles;
