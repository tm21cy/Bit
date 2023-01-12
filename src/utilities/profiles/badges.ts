import Flags from "../../enums/flags";
import badgesArray from "./badgesArray";

class Badges {
  /**
   * Retrieves a stringified list of badges that a user holds, according to their profile flag value.
   * This list is obtained by taking the logical AND of the `flags` variable against every valid enumerator value.
   * @param flags The flags field from a user's profile.
   * @returns A string array containing every badge the user has.
   * @example
   * console.log(Badges.getBadges(0)) // prints ["None"]
   * console.log(Badges.getBadges(2)) // prints ["SeniorMod"]
   */
  public static getBadges(flags: number): number[] {
    let badgesArray: number[] = [];
    let i = 0;
    if (flags == 0) badgesArray = [0];
    else {
      Object.entries(Flags).forEach(([key, value]) => {
        if (isNaN(parseInt(key))) {
          let bitValue = parseInt(value as string);
          if (bitValue != 0 && (flags & bitValue) == bitValue)
            badgesArray.push(i);
          i++;
        }
      });
    }
    return badgesArray;
  }

  /**
   * Retrieves an array of emoji IDs to display badges on a user's profile. Utilizes functionality found in `Badges.getBadges()`.
   * @param flags The flags field from a user's profile.
   * @returns A string array containing the ID of each applicable badge's emoji. Returns void if the array contains the "None" enumerator key.
   */
  public static getBadgeEmojis(flags: number): string[] {
    const barr: number[] = this.getBadges(flags);
    let ret: string[] = [];
    for (let idx of barr) {
      ret.push(badgesArray[idx]);
    }

    return ret;
  }
}

export default Badges;
