import Flags from "../../enums/flags";
import badgesArray, { badgeDescs } from "./badgesArray";
import { BadgeData } from "../../types/Interfaces";

class Badges {
  /**
   * Retrieves the indices and the names of any badges the user holds.
   * This list is obtained by taking the logical AND of the `flags` variable against every valid enumerator value.
   * @param flags The flags field from a user's profile.
   * @returns An object containing the names and indices of the badges.
   */
  public static getBadges(flags: number): BadgeData {
    let badgesArray: number[] = [];
    let nameArray: string[] = [];
    let i = 0;
    if (flags == 0) badgesArray = [0];
    else {
      Object.entries(Flags).forEach(([key, value]) => {
        if (isNaN(parseInt(key))) {
          let bitValue = parseInt(value as string);
          if (bitValue != 0 && (flags & bitValue) == bitValue)
            badgesArray.push(i);
          nameArray.push(key);
          i++;
        }
      });
    }
    return {
      names: nameArray,
      indices: badgesArray,
    };
  }

  /**
   * Retrieves an array of emoji IDs to display badges on a user's profile. Utilizes functionality found in `Badges.getBadges()`.
   * @param flags The flags field from a user's profile.
   * @returns A string array containing the ID of each applicable badge's emoji. Returns void if the array contains the "None" enumerator key.
   */
  public static getBadgeEmojis(flags: number): string[] {
    const barr: number[] = this.getBadges(flags).indices;
    let ret: string[] = [];
    for (let idx of barr) {
      ret.push(badgesArray[idx]);
    }

    return ret;
  }

  public static getDescriptions(flags: number): string[] {
    const barr: number[] = this.getBadges(flags).indices;
    let ret: string[] = [];
    for (let idx of barr) {
      ret.push(`${badgesArray[idx]} ${badgeDescs[idx]}`);
    }

    return ret;
  }
}

export default Badges;
