import { DataTypes, Model, Optional } from "sequelize";
import { db } from "./Sequelizes";

interface LikeUserAttributes {
  id: number;
  target_id: string;
  author_id: string;
}

export interface LikeUserInput extends Optional<LikeUserAttributes, "id"> {}
export interface LikeUserOutput extends Required<LikeUserAttributes> {}

class LikeUser
  extends Model<LikeUserAttributes, LikeUserInput>
  implements LikeUserAttributes
{
  public id!: number;
  public target_id!: string;
  public author_id!: string;
}

LikeUser.init(
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
    author_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    sequelize: db,
    paranoid: false,
    tableName: "like_users",
  }
);

export default LikeUser;
