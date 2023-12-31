import Sequelize, { CreationOptional, INTEGER, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import Counseling from './counseling';
import Question from './question';
import Answer from './answer';

// 사용자
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare password: CreationOptional<string>;
	declare nickname: string;
	declare contact: CreationOptional<string>;
	declare provider: CreationOptional<string>;
	declare providerId: CreationOptional<string>;

	static initiate(sequelize: Sequelize.Sequelize) {
		User.init(
			{
				id: {
					type: INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				email: {
					type: Sequelize.STRING(100),
					unique: true,
					allowNull: true,
				},
				password: {
					type: Sequelize.STRING(100),
					allowNull: true,
				},
				nickname: {
					type: Sequelize.STRING(30),
					allowNull: false,
				},
				contact: {
					type: Sequelize.STRING,
					unique: true,
				},
				provider: {
					type: Sequelize.ENUM('local', 'kakao', 'google'),
					allowNull: false,
					defaultValue: 'local',
				},
				providerId: {
					type: Sequelize.STRING,
					unique: true,
				},
			},
			{
				sequelize,
				timestamps: true,
				paranoid: true,
				underscored: false,
				modelName: 'User',
				tableName: 'users',
				charset: 'utf8',
				collate: 'utf8_general_ci',
			}
		);
	}

	static associate() {
		User.hasMany(Counseling, { foreignKey: 'userId', sourceKey: 'id' });
		User.hasMany(Question, { foreignKey: 'userId', sourceKey: 'id' });
		User.hasMany(Answer, { foreignKey: 'userId', sourceKey: 'id' });
	}
}
