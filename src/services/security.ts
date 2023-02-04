import { User } from "discord.js"
import { SecurityResponse } from "../types/Interfaces"
import { log } from "./logger"

interface PasswordIssue {
	safe: boolean
	machineReadable: string | null
	userReadable: string | null
}

const commonPasswords = [
	"123456",
	"password",
	"12345678",
	"qwerty",
	"123456789",
	"12345",
	"1234",
	"111111",
	"1234567",
	"123123",
	"abc123",
	"football",
	"monkey",
	"letmein",
	"696969",
	"master",
	"666666",
	"qwertyuiop",
	"123321",
	"1234567890",
	"654321",
	"superman",
	"7777777",
	"121212",
	"000000",
	"123qwe",
	"Password1",
	"Password1@"
]

/**
 * Security Class - it is HIGHLY discouraged that you use this existing module when self-deploying.
 * If you do use this class, please ensure you have configured an appropriate API or alternate verification method.
 */
export class Security {
	/**
	 * Checks if a user is allowed to use eval or exec.
	 * @param user The user to check.
	 * @returns Whether the user is allowed to use eval or exec.
	 */
	public static async isEvalerUser(user: User): Promise<SecurityResponse> {
		const result =
			user.id === process.env.DEV_ID_1 || user.id === process.env.DEV_ID_2

		if (!result) {
			return {
				status: 0,
				message: "Unauthorized user"
			}
		}

		return {
			status: 1,
			message: "Authorized and authenticated"
		}
	}
	/**
	 * Checks if a eval is allowed to execute.
	 * @param code The code to check
	 * @param user The user who is executing the code
	 * @returns True if safe
	 * @throws Error if unsafe
	 */
	public static async evalCheck(code: string, user: User) {
		const disallowed = [
			"secret",
			"token",
			"process.env",
			"SECRET",
			"TOKEN",
			"PROCESS.ENV",
			"client.token",
			"CLIENT.TOKEN",
			"require('child_process');",
			"MONGO_URI"
		]
		if (!(await Security.isEvalerUser(user))) {
			return {
				status: 0,
				message: "Unauthorized user"
			}
		}

		if (
			disallowed.some((disallowedSnippet) => code.includes(disallowedSnippet))
		) {
			log.warn(
				code,
				`The code provided by ${user.tag} (${user.id}) is not allowed to be eval - dangerous code`
			)
			return {
				status: 0,
				message: "Dangerous evaluation input"
			}
		}

		return {
			status: 1,
			message: "Authorized and authenticated"
		}
	}

	public static async execCheck(code: string, user: User) {
		const disallowed = [
			"secret",
			"token",
			"process.env",
			"SECRET",
			"TOKEN",
			"PROCESS.ENV",
			"client.token",
			"CLIENT.TOKEN",
			"require('child_process');",
			"MONGO_URI",
			".env",
			"rm",
			"rm -rf",
			":(){:|:&};:",
			"/dev/sda",
			"mv /home/user/* /dev/null",
			"mkfs.ext3 /dev/sda",
			"dd if=/dev/random of=/dev/sda",
			"sudo apt purge python2.x-minimal",
			"chmod -R 777 /"
		]
		if (!(await Security.isEvalerUser(user))) {
			return {
				status: 0,
				message: "Unauthorized user"
			}
		}

		if (
			disallowed.some((disallowedSnippet) => code.includes(disallowedSnippet))
		) {
			log.warn(
				code,
				`The code provided by ${user.tag} (${user.id}) is not allowed to be executed - dangerous code`
			)
			return {
				status: 0,
				message: "Dangerous execution input"
			}
		}

		return {
			status: 1,
			message: "Authorized and authenticated"
		}
	}

	/**
	 * Verifies that password meets internal security guidelines.
	 * @param password The password to check.
	 * @param id The user ID belonging to the password request.
	 * @returns PasswordIssue Promise containing results.
	 * @example
	 * const myBadPass = "abc123"
	 * const myId = "12345"
	 * const result: PasswordIssue = await Security.passwordCheck(myBadPass, myId)
	 * // Expected Output: {safe: false, machineReadable: "length", userReadable: "Your password must be at least 12 characters long."}
	 *
	 * const myGoodPass = "GYHbfds8y743!bfdjs"
	 * const result: PasswordIssue = await Security.passwordCheck(myGoodPass, myId)
	 * // Expected Output: {safe: true, machineReadable: null, userReadable: null}
	 */
	public static async passwordCheck(password: string, id: string) {
		switch (true) {
			case password.length < 12:
				return {
					safe: false,
					machineReadable: "length",
					userReadable: "Your password must be at least 12 characters long."
				} as PasswordIssue
			case !password.match(/([A-Z])/):
				return {
					safe: false,
					machineReadable: "uppercase",
					userReadable:
						"Your password must contain at least one uppercase character."
				} as PasswordIssue
			case !password.match(/([0-9])/):
				return {
					safe: false,
					machineReadable: "number",
					userReadable: "Your password must contain at least one number."
				} as PasswordIssue
			case password.includes(id):
				return {
					safe: false,
					machineReadable: "id",
					userReadable: "Your password may not contain your ID."
				} as PasswordIssue
			case commonPasswords.includes(password):
				return {
					safe: false,
					machineReadable: "common",
					userReadable: "Your password is too common."
				} as PasswordIssue
			default:
				return {
					safe: true,
					machineReadable: null,
					userReadable: null
				} as PasswordIssue
		}
	}
}
