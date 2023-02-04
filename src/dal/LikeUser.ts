import { Op } from "sequelize"
import LikeUser, { LikeUserInput, LikeUserOutput } from "../models/LikeUser"
import { LikeUserDALFilters } from "./types/LikeUserDALFilters"

export const create = async (
	payload: LikeUserInput
): Promise<LikeUserOutput> => {
	return await LikeUser.create(payload)
}

export const update = async (
	id: number,
	payload: Partial<LikeUserInput>
): Promise<LikeUserOutput> => {
	let ret = await LikeUser.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return await (ret as LikeUser).update(payload)
}

export const getById = async (id: number): Promise<LikeUserOutput> => {
	let ret = await LikeUser.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return ret
}

export const deleteById = async (id: number): Promise<boolean> => {
	const deleteCount = await LikeUser.destroy({
		where: { id }
	})
	return !!deleteCount
}

export const getAll = async (
	filters?: LikeUserDALFilters
): Promise<LikeUserOutput[]> => {
	return LikeUser.findAll({
		where: {
			...(filters?.target_id && { target_id: { [Op.eq]: filters.target_id } }),
			...(filters?.author_id && { author_id: { [Op.eq]: filters.author_id } })
		}
	})
}
