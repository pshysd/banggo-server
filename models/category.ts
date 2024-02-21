import Sequelize, { InferAttributes, InferCreationAttributes, Model, STRING } from 'sequelize';
import Counseling from './counseling';
import Question from './question';

// 카테고리
export default class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
	declare id: number;
	declare name: string;

	static initiate(sequelize: Sequelize.Sequelize) {
		Category.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: Sequelize.STRING(30),
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
		Category.hasMany(Question, { foreignKey: 'category', sourceKey: 'id' });
	}
}
