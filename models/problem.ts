import {
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	CreationOptional,
	STRING,
	DATE,
	NOW,
	INTEGER,
} from 'sequelize';
import Counseling from './counseling';

class Problem extends Model<InferAttributes<Problem>, InferCreationAttributes<Problem>> {
	declare id: CreationOptional<number>;
	declare counselingId: ForeignKey<Counseling['id']>;
	declare title: string;

	static initiate(sequelize: Sequelize) {
		Problem.init(
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
