import { DataTypes, Model, Optional } from "sequelize";
import { db } from "./Sequelizes";

interface NotificationAttributes {
  id: number;
  target_id: string;
  timestamp: string;
  text: string;
  marked_read: boolean;
  subject: string;
}

export interface NotificationInput
  extends Optional<NotificationAttributes, "id" | "marked_read"> {}
export interface NotificationOutput extends Required<NotificationAttributes> {}

class Notification
  extends Model<NotificationAttributes, NotificationInput>
  implements NotificationAttributes
{
  public id!: number;
  public target_id!: string;
  public timestamp!: string;
  public text!: string;
  public marked_read!: boolean;
  public subject!: string;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    target_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    marked_read: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    subject: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "New Notification!",
    },
  },
  {
    timestamps: false,
    sequelize: db,
    paranoid: false,
    tableName: "notifications",
  }
);

export default Notification;
