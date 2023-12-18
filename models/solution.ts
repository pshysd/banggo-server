import {
	BOOLEAN,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	STRING,
	Sequelize,
	CreationOptional,
	INTEGER,
} from 'sequelize';
import Counseling from './counseling';

// 해결방안
class Solution extends Model<InferAttributes<Solution>, InferCreationAttributes<Solution>> {
	declare id: CreationOptional<number>;
	declare counselingId: ForeignKey<Counseling['id']>;
	declare title: string;
	declare isSolved: CreationOptional<boolean>;

	static initiate(sequelize: Sequelize) {
		Solution.init(
			{
				id: {
					type: INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				title: {
					type: STRING,
					allowNull: false,
				},
				isSolved: {
					type: BOOLEAN,
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
