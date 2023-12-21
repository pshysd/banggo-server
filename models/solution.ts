import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import Counseling from './counseling';

// 해결방안
class Solution extends Model<InferAttributes<Solution>, InferCreationAttributes<Solution>> {
	declare id: CreationOptional<number>;
	declare counselingId: ForeignKey<Counseling['id']>;
	declare description: string;
	declare isSolved: CreationOptional<boolean>;

	static initiate(sequelize: Sequelize.Sequelize) {
		Solution.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				isSolved: {
					type: Sequelize.BOOLEAN,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: false,
				modelName: 'Solution',
				tableName: 'solutions',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		Solution.belongsTo(Counseling, { foreignKey: 'counselingId', targetKey: 'id' });
	}
}

export default Solution;
