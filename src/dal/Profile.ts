import { Op } from "sequelize"
import Profile, { ProfileInput, ProfileOutput } from "../models/Profile"
import { ProfileDALFilters } from "./types/ProfileDALFilters"

export const create = async (payload: ProfileInput): Promise<ProfileOutput> => {
	return await Profile.create(payload)
}

export const update = async (
	id: number,
	payload: Partial<ProfileInput>
): Promise<ProfileOutput> => {
	let ret = await Profile.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return await (ret as Profile).update(payload)
}

export const getById = async (id: number): Promise<ProfileOutput> => {
	let ret = await Profile.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return ret
}

export const deleteById = async (id: number): Promise<boolean> => {
	const deleteCount = await Profile.destroy({
		where: { id }
	})
	return !!deleteCount
}

export const getAll = async (
	filters?: ProfileDALFilters
): Promise<ProfileOutput[]> => {
	return Profile.findAll({
		where: {
			...(filters?.display_name && {
				display_name: { [Op.eq]: filters.display_name }
			}),
			...(filters?.display_name_like && {
				display_name: { [Op.substring]: filters.display_name_like }
			}),
			...(filters?.user_id && {
				user_id: { [Op.eq]: filters.user_id }
			})
		}
	})
}

export const increment = async (
	id: number,
	mode: "hits" | "likes" | "rep"
): Promise<ProfileOutput> => {
	let ret = await Profile.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	if (mode === "hits") {
		await ret.increment("hits", { by: 1 })
	} else if (mode === "likes") {
		await ret.increment("likes", { by: 1 })
	} else {
		await ret.increment("rep", { by: 1 })
	}
	await ret.reload()
	return ret
}
