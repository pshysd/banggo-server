import {
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	STRING,
	Sequelize,
	CreationOptional,
	DATE,
	NOW,
	INTEGER,
	UUID,
} from 'sequelize';
import Category from './category';
import User from './user';
import Problem from './problem';
import Solution from './solution';

class Counseling extends Model<InferAttributes<Counseling>, InferCreationAttributes<Counseling>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare category: ForeignKey<Category['id']>;
	declare title: string;

	static initiate(sequelize: Sequelize) {
		Counseling.init(
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
				paranoid: true,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				modelName: 'Counseling',
				tableName: 'counselings',
			}
		);
	}

	static associate() {
		Counseling.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
		Counseling.belongsTo(Category, { foreignKey: 'category', targetKey: 'id' });
		Counseling.hasMany(Problem, { foreignKey: 'counselingId', sourceKey: 'id' });
		Counseling.hasMany(Solution, { foreignKey: 'counselingId', sourceKey: 'id' });
	}
}

export default Counseling;
