import { Router } from "express"
import Query from "../../routes/Query"

let status = Router()

status.get("/", async (_req, res) => {
	await Query.status().then((status) => {
		res.send({
			status
		})
	})
})

export default status
