import { DataTypes, Model, Optional } from "sequelize"
import { db } from "./Sequelizes"

interface CommentAttributes {
	id: number
	target_id: string
	author_id: string
	author_tag: string
	message: string
	timestamp: string
}

export interface CommentInput extends Optional<CommentAttributes, "id"> {}
export interface CommentOutput extends Required<CommentAttributes> {}

class Comment
	extends Model<CommentAttributes, CommentInput>
	implements CommentAttributes
{
	public id!: number
	public target_id!: string
	public author_id!: string
	public author_tag!: string
	public message!: string
	public timestamp!: string
}

Comment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		target_id: {
			type: DataTypes.STRING(24),
			allowNull: false
		},
		author_id: {
			type: DataTypes.STRING(24),
			allowNull: false
		},
		author_tag: {
			type: DataTypes.STRING(38),
			allowNull: false
		},
		message: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		timestamp: {
			type: DataTypes.STRING(10),
			allowNull: false
		}
	},
	{
		timestamps: false,
		sequelize: db,
		paranoid: false,
		tableName: "comments"
	}
)

export default Comment
