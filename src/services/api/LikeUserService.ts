import * as dal from "../../dal/LikeUser";
import {
  LikeUserInput as Input,
  LikeUserOutput as Output,
} from "../../models/LikeUser";
import { LikeUserDALFilters as DALFilters } from "../../dal/types/LikeUserDALFilters";

export const create = (payload: Input): Promise<Output> => {
  return dal.create(payload);
};

export const update = (
  id: number,
  payload: Partial<Input>
): Promise<Output> => {
  return dal.update(id, payload);
};

export const getById = (id: number): Promise<Output> => {
  return dal.getById(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return dal.deleteById(id);
};

export const getAll = (filters?: DALFilters): Promise<Output[]> => {
  return dal.getAll(filters);
};
