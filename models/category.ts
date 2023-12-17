import { INTEGER, InferAttributes, InferCreationAttributes, Model, NUMBER, STRING, Sequelize } from 'sequelize';
import Counseling from './counseling';

export default class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
	declare id: number;
	declare name: string;

	static initiate(sequelize: Sequelize) {
		Category.init(
			{
				id: {
					type: INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: STRING(30),
					allowNull: false,
				},
			},
			{
				sequelize,
				timestamps: false,
				paranoid: false,
				underscored: false,
				modelName: 'Category',
				tableName: 'categories',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		Category.hasMany(Counseling, { foreignKey: 'category', sourceKey: 'id' });
	}
}
