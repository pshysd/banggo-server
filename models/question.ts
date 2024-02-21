import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes, Model, CreationOptional, STRING, INTEGER } from 'sequelize';
import User from './user';
import Category from './category';
import SelectedAnswer from './selected-answer';

// 문제사항
class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
	declare id: CreationOptional<number>;
	declare title: string;
	declare content: string;
	declare views: number;
	declare likes: number;

	declare category: ForeignKey<Category['id']>;
	declare userId: ForeignKey<User['id']>;

	static initiate(sequelize: Sequelize.Sequelize) {
		Question.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				content: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				views: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				likes: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: false,
				modelName: 'Question',
				tableName: 'questions',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		Question.belongsTo(Category, { foreignKey: 'category', targetKey: 'id' });
		Question.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
		Question.hasOne(SelectedAnswer, { foreignKey: 'questionId', sourceKey: 'id' });
	}
}

export default Question;