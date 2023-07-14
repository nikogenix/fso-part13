const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class ReadingList extends Model {}

ReadingList.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		blogId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "blogs", key: "id" },
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: "reading_lists",
	}
);

module.exports = ReadingList;
