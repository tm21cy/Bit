import { DataTypes, Model, Optional } from "sequelize";
import { db } from "./Sequelizes";

interface ProfileAttributes {
  id: number;
  display_name: string;
  badge_flags: number;
  user_id: string;
  bio: string;
  display_picture: string;
  hits: number;
  likes: number;
  muted: boolean;
  notif_on_likes: boolean;
  notif_on_comments: boolean;
  notif_on_general: boolean;
}

export interface ProfileInput
  extends Optional<
    ProfileAttributes,
    | "id"
    | "badge_flags"
    | "bio"
    | "hits"
    | "likes"
    | "muted"
    | "notif_on_comments"
    | "notif_on_general"
    | "notif_on_likes"
  > {}
export interface ProfileOutput extends Required<ProfileAttributes> {}

class Profile
  extends Model<ProfileAttributes, ProfileInput>
  implements ProfileAttributes
{
  public id!: number;
  public display_name!: string;
  public badge_flags!: number;
  public user_id!: string;
  public bio!: string;
  public display_picture!: string;
  public hits!: number;
  public likes!: number;
  public muted!: boolean;
  public notif_on_likes!: boolean;
  public notif_on_comments!: boolean;
  public notif_on_general!: boolean;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    display_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    badge_flags: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      defaultValue: "Hello, world!",
    },
    display_picture: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    hits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    muted: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    notif_on_likes: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    notif_on_comments: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    notif_on_general: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    sequelize: db,
    paranoid: false,
    tableName: "profiles",
  }
);

export default Profile;
