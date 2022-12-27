"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    static decodeBase64(base64String) {
        return Buffer.from(base64String, "base64").toString("ascii");
    }
}
exports.default = util;
