import * as dal from "../../dal/Helper";
import {
  HelperInput as Input,
  HelperOutput as Output,
} from "../../models/Helper";
import { HelperDALFilters as DALFilters } from "../../dal/types/HelperDALFilters";

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
