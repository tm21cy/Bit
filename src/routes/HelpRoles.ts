import { db } from "../models/Sequelizes";
import { QueryTypes } from "sequelize";
import { Delete, Get, Post, Status } from "../types/Interfaces";
import _ from "lodash";
import { languages, platforms } from "../types/help-roles";
import * as HelperService from "../services/api/HelperService";
import { HelperInput } from "../models/Helper";

/**
 * Routing class for the Helper role system.
 */
class HelpRoles {
  /**
   * Retrieves a list of helper roles the target user is currently assigned to.
   * @param user_id The Discord ID Snowflake of the target.
   * @param type Whether the roles fetched should be of the Languages or Platforms type, or whether it should include both.
   * @returns A Promise containing the user ID and a list of languages assigned, and a status code.
   */
  async retrieveRoles(
    user_id: string,
    type: "langs" | "platforms" | "both"
  ): Promise<Get> {
    let ret = await HelperService.getAll({ user_id: user_id });
    let langs = ret.map((idx) => {
      return idx.lang;
    });

    switch (type) {
      case "langs":
        langs = _.intersection(langs, languages);
        break;
      case "platforms":
        langs = _.intersection(langs, platforms);
        break;
    }

    return {
      data: {
        user_id,
        langs: langs,
      },
      status: Status.OK,
    };
  }

  /**
   * Adds 1...*n* helper roles to a target user.
   * @param user_id The Discord ID Snowflake of the target.
   * @param langs Any languages you wish to assign the user to. There are no bounds on this input, both on content and on length.
   * @returns A Promise containing the data of the new table entry, a status code, and the names of any languages that failed to input, if any.
   */
  async addRoles(user_id: string, ...langs: string[]): Promise<Post> {
    let failPosts: string[] = [];
    let existingRoles: string[] = (
      await HelperService.getAll({ user_id: user_id })
    ).map((idx) => idx.lang as string);

    langs = _.difference(langs, existingRoles);
    for (let lang of langs) {
      let object: HelperInput = {
        user_id,
        lang,
      };
      await HelperService.create(object).catch(() => {
        failPosts.push(lang);
      });
    }
    let status = failPosts.length > 0 ? Status.PARTIAL : Status.OK;
    console.log(failPosts);
    return {
      data: {
        user_id,
        langs: _.difference(langs, failPosts),
      },
      status,
      fails: failPosts,
    };
  }

  /**
   * Removes 1...*n* helper roles from a target user.
   * @param user_id The Discord ID Snowflake of the target.
   * @param langs Any languages you wish to remove from the user. Invalid inputs will be skipped.
   * @returns A Promise containing the data of the old table entry, the languages removed, a status code, and any languages that failed to remove, if any.
   */
  async removeRoles(user_id: string, ...langs: string[]): Promise<Delete> {
    let failDels: string[] = [];
    let userLangs: string[] =
      (await HelperService.getAll({ user_id: user_id })).map((idx) => {
        return idx.lang;
      }) ?? [];
    langs = _.intersection(langs, userLangs);
    for (let lang of langs) {
      let object = {
        user_id,
        lang,
      };
      await HelperService.create(object).catch(() => failDels.push(lang));
    }
    let status = failDels.length > 0 ? Status.PARTIAL : Status.OK;
    return {
      oldData: {
        user_id,
        langs: userLangs,
      },
      changes: {
        langs,
      },
      status,
      fails: failDels,
    };
  }

  /**
   * Fetches a list of users who currently have a helper role. Returns an object with Status.NOTFOUND if there are no assigned users.
   * @param lang The language to use as a user filter.
   * @returns A Promise containing the users found, the language used as a search term, and a status code.
   */
  async getUsers(lang: string): Promise<Get> {
    const ret = await HelperService.getAll({ lang: lang });
    let users = ret.map((idx) => {
      return idx.user_id;
    });
    if (users.length == 0) {
      return {
        data: {
          users: [],
          lang,
        },
        status: Status.NOTFOUND,
      };
    } else {
      return {
        data: {
          users,
          lang,
        },
        status: Status.OK,
      };
    }
  }
}

export default HelpRoles;
