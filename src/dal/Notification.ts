import { Op } from "sequelize";
import Notification, {
  NotificationInput,
  NotificationOutput,
} from "../models/Notification";
import { NotificationDALFilters } from "./types/NotificationDALFilters";

export const create = async (
  payload: NotificationInput
): Promise<NotificationOutput> => {
  return await Notification.create(payload);
};

export const update = async (
  id: number,
  payload: Partial<NotificationInput>
): Promise<NotificationOutput> => {
  let ret = await Notification.findByPk(id);
  if (!ret) throw new Error(`Comment entry not found for ID ${id}.`);
  return await (ret as Notification).update(payload);
};

export const getById = async (id: number): Promise<NotificationOutput> => {
  let ret = await Notification.findByPk(id);
  if (!ret) throw new Error(`Comment entry not found for ID ${id}.`);
  return ret;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deleteCount = await Notification.destroy({
    where: { id },
  });
  return !!deleteCount;
};

export const getAll = async (
  filters?: NotificationDALFilters
): Promise<NotificationOutput[]> => {
  let read: number = filters?.marked_read ? 1 : 0;
  return Notification.findAll({
    where: {
      ...(filters?.target_id && { target_id: { [Op.eq]: filters.target_id } }),
      ...(typeof filters?.marked_read !== "undefined" && {
        marked_read: { [Op.eq]: read },
      }),
    },
  });
};
