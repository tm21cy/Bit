import * as dal from "../../dal/Profile";
import {
  ProfileInput as Input,
  ProfileOutput,
  ProfileOutput as Output,
} from "../../models/Profile";
import { ProfileDALFilters as DALFilters } from "../../dal/types/ProfileDALFilters";

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

export const increment = (
  id: number,
  mode: "hits" | "likes" | "rep"
): Promise<ProfileOutput> => {
  return dal.increment(id, mode);
};
