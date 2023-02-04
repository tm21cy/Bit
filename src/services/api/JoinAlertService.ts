import * as dal from "../../dal/JoinAlert"
import { JoinAlertDALFilters as DALFilters } from "../../dal/types/JoinAlertDALFilters"
import {
	JoinAlertInput as Input,
	JoinAlertOutput as Output
} from "../../models/JoinAlert"

export const create = (payload: Input): Promise<Output> => {
	return dal.create(payload)
}

export const update = (
	id: number,
	payload: Partial<Input>
): Promise<Output> => {
	return dal.update(id, payload)
}

export const getById = (id: number): Promise<Output> => {
	return dal.getById(id)
}

export const deleteById = (id: number): Promise<boolean> => {
	return dal.deleteById(id)
}

export const getAll = (filters?: DALFilters): Promise<Output[]> => {
	return dal.getAll(filters)
}
