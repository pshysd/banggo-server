import Sequelize, {
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	CreationOptional,
	DataTypes,
	NonAttribute,
} from 'sequelize';
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
	declare AIAnswer: CreationOptional<string | null>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare deletedAt: Date | null;

	// include option
	declare Problems?: NonAttribute<Problem[]>;
	declare Solutions?: NonAttribute<Solution[]>;
	declare Category?: NonAttribute<Category>;

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
				createdAt: {
					type: Sequelize.DATE,
					comment: '게시글 작성일',
				},
				updatedAt: {
					type: Sequelize.DATE,
					comment: '게시글 수정일',
				},
				deletedAt: {
					type: Sequelize.DATE,
					comment: '게시글 삭제일',
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
