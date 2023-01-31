import { Op } from "sequelize"
import Comment, { CommentInput, CommentOutput } from "../models/Comment"
import { CommentDALFilters } from "./types/CommentDALFilters"

export const create = async (payload: CommentInput): Promise<CommentOutput> => {
	return await Comment.create(payload)
}

export const update = async (
	id: number,
	payload: Partial<CommentInput>
): Promise<CommentOutput> => {
	let ret = await Comment.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return await (ret as Comment).update(payload)
}

export const getById = async (id: number): Promise<CommentOutput> => {
	let ret = await Comment.findByPk(id)
	if (!ret) throw new Error(`Comment entry not found for ID ${id}.`)
	return ret
}

export const deleteById = async (id: number): Promise<boolean> => {
	const deleteCount = await Comment.destroy({
		where: { id }
	})
	return !!deleteCount
}

export const getAll = async (
	filters?: CommentDALFilters
): Promise<CommentOutput[]> => {
	return Comment.findAll({
		where: {
			...(filters?.target_id && { target_id: { [Op.eq]: filters.target_id } }),
			...(filters?.author_id && { author_id: { [Op.eq]: filters.author_id } }),
			...(filters?.author_tag && {
				author_tag: { [Op.eq]: filters.author_tag }
			})
		}
	})
}
