/**
 * Provides general utility functions which cannot be categorized.
 * @class
 */
class util {
  /**
   * Decodes a base64 string.
   * @param {string} base64String The base64 string to decode.
   * @returns {string} The decoded string.
   */
  public static decodeBase64(base64String: string): string {
    return Buffer.from(base64String, "base64").toString("ascii");
  }

  /**
   * Verifies the authenticity of a developer's usage of a command.
   * @param id The ID of the user using the command.
   * @returns
   */
  public static verifyDev(id: string): boolean {
    return id == process.env.DEV_ID_1 || id == process.env.DEV_ID_1;
  }

  public static formatTimestamp(
    option: "date" | "dateAndRelative" | "relative",
    timestamp: number
  ): string {
    switch (option) {
      case "date":
        return `<t:${Math.round(timestamp / 1000)}>`;
      case "dateAndRelative":
        return `<t:${Math.round(timestamp / 1000)}> (<t:${Math.round(
          timestamp / 1000
        )}:R>)`;
      case "relative":
        return `<t:${Math.round(timestamp / 1000)}:R>`;
    }
  }
}

export default util;
