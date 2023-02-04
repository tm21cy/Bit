import { DataTypes, Model, Optional } from "sequelize"
import { db } from "./Sequelizes"

interface JoinAlertAttributes {
	id: number
	guild_id: string
	target_id: string
	moderator_id: string
	reason: string
}

export interface JoinAlertInput extends Optional<JoinAlertAttributes, "id"> {}
export interface JoinAlertOutput extends Required<JoinAlertAttributes> {}

class JoinAlert
	extends Model<JoinAlertAttributes, JoinAlertInput>
	implements JoinAlertAttributes
{
	public id!: number
	public guild_id!: string
	public target_id!: string
	public moderator_id!: string
	public reason!: string
}

JoinAlert.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		guild_id: {
			type: DataTypes.STRING(24),
			allowNull: false
		},
		target_id: {
			type: DataTypes.STRING(24),
			allowNull: false
		},
		moderator_id: {
			type: DataTypes.STRING(24),
			allowNull: false
		},
		reason: {
			type: DataTypes.STRING(512),
			allowNull: false
		}
	},
	{
		timestamps: false,
		sequelize: db,
		paranoid: false,
		tableName: "join_alerts"
	}
)

export default JoinAlert
