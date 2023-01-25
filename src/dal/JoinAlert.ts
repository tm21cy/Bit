import JoinAlert, {
  JoinAlertInput,
  JoinAlertOutput,
} from "../models/JoinAlert";
import { JoinAlertDALFilters } from "./types/JoinAlertDALFilters";
import { Op } from "sequelize";

export const create = async (
  payload: JoinAlertInput
): Promise<JoinAlertOutput> => {
  return await JoinAlert.create(payload);
};

export const update = async (
  id: number,
  payload: Partial<JoinAlertInput>
): Promise<JoinAlertOutput> => {
  let ret = await JoinAlert.findByPk(id);
  if (!ret) throw new Error(`JoinAlert entry not found for ID ${id}.`);
  return await (ret as JoinAlert).update(payload);
};

export const getById = async (id: number): Promise<JoinAlertOutput> => {
  let ret = await JoinAlert.findByPk(id);
  if (!ret) throw new Error(`Comment entry not found for ID ${id}.`);
  return ret;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deleteCount = await JoinAlert.destroy({
    where: { id },
  });
  return !!deleteCount;
};

export const getAll = async (
  filters?: JoinAlertDALFilters
): Promise<JoinAlertOutput[]> => {
  return JoinAlert.findAll({
    where: {
      ...(filters?.target_id && { target_id: { [Op.eq]: filters.target_id } }),
      ...(filters?.guild_id && { guild_id: { [Op.eq]: filters.guild_id } }),
      ...(filters?.moderator_id && {
        moderator_id: { [Op.eq]: filters.moderator_id },
      }),
    },
  });
};
