import * as dotenv from "dotenv"
import pino from "pino"
const log = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			ignore: "pid,hostname",
		}
	}
})
dotenv.config()

export { log }