import { DataTypes, Model, Optional } from "sequelize";
import { db } from "./Sequelizes";

interface HelperAttributes {
  id: number;
  user_id: string;
  lang: string;
}

export interface HelperInput extends Optional<HelperAttributes, "id"> {}
export interface HelperOutput extends Required<HelperAttributes> {}

class Helper
  extends Model<HelperAttributes, HelperInput>
  implements HelperAttributes
{
  public id!: number;
  public user_id!: string;
  public lang!: string;
}

Helper.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    sequelize: db,
    paranoid: false,
    tableName: "helpers",
  }
);

export default Helper;
