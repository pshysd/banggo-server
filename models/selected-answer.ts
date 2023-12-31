import Sequelize, { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import Question from './question';
import Answer from './answer';

class SelectedAnswer extends Model<InferAttributes<SelectedAnswer>, InferCreationAttributes<SelectedAnswer>> {
	declare id: CreationOptional<number>;
	declare message: CreationOptional<string>;

	declare questionId: ForeignKey<Question['id']>;
	declare answerId: ForeignKey<Answer['id']>;

	static initiate(sequelize: Sequelize.Sequelize) {
		SelectedAnswer.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				message: {
					type: Sequelize.STRING,
					allowNull: true,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: true,
				modelName: 'SelectedAnswer',
				tableName: 'selectedAnswers',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		SelectedAnswer.belongsTo(Question, { foreignKey: 'questionId', targetKey: 'id' });
		SelectedAnswer.belongsTo(Answer, { foreignKey: 'answerId', targetKey: 'id' });
	}
}

export default SelectedAnswer;
