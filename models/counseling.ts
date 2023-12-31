import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER } from 'sequelize';
import Category from './category';
import User from './user';
import Problem from './problem';
import Solution from './solution';

// 상담기록
class Counseling extends Model<InferAttributes<Counseling>, InferCreationAttributes<Counseling>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare category: ForeignKey<Category['id']>;
	declare description: string;
	declare AIAnswer: string;

	static initiate(sequelize: Sequelize.Sequelize) {
		Counseling.init(
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
				AIAnswer: {
					type: Sequelize.STRING,
					allowNull: true,
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
