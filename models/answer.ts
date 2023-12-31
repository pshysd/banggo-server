import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import User from './user';
import Question from './question';
import Sequelize from 'sequelize';
import SelectedAnswer from './selected-answer';

class Answer extends Model<InferAttributes<Answer>, InferCreationAttributes<Answer>> {
	declare id: CreationOptional<number>;
	declare content: CreationOptional<string>;
	declare likes: CreationOptional<number>;

	declare userId: ForeignKey<User['id']>;
	declare questionId: ForeignKey<Question['id']>;

	static inititate(sequelize: Sequelize.Sequelize) {
		Answer.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				content: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				likes: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
					allowNull: false,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: true,
				underscored: false,
				modelName: 'Answer',
				tableName: 'answers',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		Answer.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
		Answer.belongsTo(Question, { foreignKey: 'questionId', targetKey: 'id' });
		Answer.hasOne(SelectedAnswer, { foreignKey: 'answerId', sourceKey: 'id' });
	}
}

export default Answer;
