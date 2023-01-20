import { Op } from "sequelize";
import Helper, { HelperInput, HelperOutput } from "../models/Helper";
import { HelperDALFilters } from "./types/HelperDALFilters";

export const create = async (payload: HelperInput): Promise<HelperOutput> => {
  return await Helper.create(payload);
};

export const update = async (
  id: number,
  payload: Partial<HelperInput>
): Promise<HelperOutput> => {
  let ret = await Helper.findByPk(id);
  if (!ret) throw new Error(`Comment entry not found for ID ${id}.`);
  return await (ret as Helper).update(payload);
};

export const getById = async (id: number): Promise<HelperOutput> => {
  let ret = await Helper.findByPk(id);
  if (!ret) throw new Error(`Comment entry not found for ID ${id}.`);
  return ret;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deleteCount = await Helper.destroy({
    where: { id },
  });
  return !!deleteCount;
};

export const getAll = async (
  filters?: HelperDALFilters
): Promise<HelperOutput[]> => {
  return Helper.findAll({
    where: {
      ...(filters?.user_id && { user_id: { [Op.eq]: filters.user_id } }),
      ...(filters?.lang && { lang: { [Op.eq]: filters.lang } }),
    },
  });
};
