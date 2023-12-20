import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes, Model, CreationOptional, STRING, INTEGER } from 'sequelize';
import Counseling from './counseling';

// 문제사항
class Problem extends Model<InferAttributes<Problem>, InferCreationAttributes<Problem>> {
	declare id: CreationOptional<number>;
	declare counselingId: ForeignKey<Counseling['id']>;
	declare title: string;

	static initiate(sequelize: Sequelize.Sequelize) {
		Problem.init(
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
			},
			{
				sequelize,
				timestamps: true,
				paranoid: false,
				modelName: 'Problem',
				tableName: 'problems',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		Problem.belongsTo(Counseling, { foreignKey: 'counselingId', targetKey: 'id' });
	}
}

export default Problem;
