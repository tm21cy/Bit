import { db } from "../models/Sequelizes";
import { Get, Post, ProfileCounter, Status } from "../types/Interfaces";
import * as ProfileService from "../services/api/ProfileService";

/**
 * Profiles routing class.
 */
class Profiles {
  async createProfile(
    displayName: string,
    userID: string,
    displayPicture: string
  ): Promise<Post> {
    let object = {
      display_name: displayName,
      badge_flags: 0,
      user_id: userID,
      display_picture: displayPicture,
    };
    let profile = await ProfileService.create(object);

    return {
      data: profile,
      status: Status.OK,
    };
  }

  async getProfileLikeUsername(username: string): Promise<Get> {
    let profiles = await ProfileService.getAll({ display_name_like: username });

    let status = profiles.length == 0 ? Status.NOTFOUND : Status.OK;

    return {
      data: profiles,
      status: status,
    };
  }

  async getProfile(
    parameters: {
      display_name?: string;
      display_name_like?: string;
      user_id?: string;
    },
    limit?: number
  ): Promise<Get> {
    let profiles = await ProfileService.getAll(parameters);
    profiles =
      limit && profiles.length > limit ? profiles.slice(0, limit) : profiles;
    if (profiles.length == 0) {
      return {
        data: [],
        status: Status.NOTFOUND,
      };
    } else if (profiles.length == 1) {
      return {
        data: profiles[0],
        status: Status.OK,
      };
    } else {
      return {
        data: profiles,
        status: Status.OK,
      };
    }
  }

  async increment(id: number, mode: "hits" | "likes"): Promise<ProfileCounter> {
    let profile = await ProfileService.increment(id, mode);
    let count = mode == "hits" ? profile.hits : profile.likes;
    return {
      id: profile.id,
      display_name: profile.display_name,
      count: count,
    };
  }
}

export default Profiles;
