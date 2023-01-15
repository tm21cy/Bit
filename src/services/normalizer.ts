import { weirdToNormalChars } from "weird-to-normal-chars"
import replaceSpecialCharacters from "replace-special-characters"
import sanitizer from "@aero/sanitizer"
class normalize {
	public static async normalize(text: string) {

		const hoistRegex = [
			/^[^A-Za-z0-9 ]+/gim,
			// eslint-disable-next-line no-irregular-whitespace
			/(​| | | | | | | | |⠀|)/gi,
		]

		text = sanitizer(text)
		text = weirdToNormalChars(text)
		text = replaceSpecialCharacters(text)

		for (let i = 0; i < 5; i++) {
			text = text.replace(hoistRegex[0], "")
			text = text.replace(hoistRegex[1], "")
		}

		if (text == " " || text == "") {
			return normalize.randNameStr("Moderated Username ")
		}

		if (text.length > 32) {
			return text.substring(0, 32)
		}

		return text
	}

	public static async randNameStr(pretext = "") {
		return `${pretext}${(Math.random() + 1).toString(36).substring(7)}`
	}
}

export default normalize