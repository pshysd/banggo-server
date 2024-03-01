import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes, Model, CreationOptional, DataTypes } from 'sequelize';
import Category from './category';
import User from './user';
import Problem from './problem';
import Solution from './solution';

// 상담기록
class Counseling extends Model<InferAttributes<Counseling>, InferCreationAttributes<Counseling>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare category: ForeignKey<Category['id']>;
	declare title: string;
	declare AIAnswer: CreationOptional<string>;

	static initiate(sequelize: Sequelize.Sequelize) {
		Counseling.init(
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
				AIAnswer: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				userId: {
					type: DataTypes.UUID,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: true,
				charset: 'utf8',
				collate: 'utf8_general_ci',
				modelName: 'Counseling',
				tableName: 'counselings',
			}
		);
	}

	static associate() {
		Counseling.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
		Counseling.belongsTo(Category, { foreignKey: 'category', targetKey: 'id' });
		Counseling.hasMany(Problem, { foreignKey: 'counselingId', sourceKey: 'id', onDelete: 'CASCADE' });
		Counseling.hasMany(Solution, { foreignKey: 'counselingId', sourceKey: 'id', onDelete: 'CASCADE' });
	}
}

export default Counseling;
