import { CreationOptional, ENUM, INTEGER, InferAttributes, InferCreationAttributes, Model, STRING, Sequelize } from 'sequelize';
import Counseling from './counseling';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare password: CreationOptional<string>;
	declare nickname: string;
	declare contact: CreationOptional<string>;
	declare provider: CreationOptional<string>;
	declare providerId: CreationOptional<string>;

	static initiate(sequelize: Sequelize) {
		User.init(
			{
				id: {
					type: INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				email: {
					type: STRING(100),
					unique: true,
					allowNull: false,
				},
				password: {
					type: STRING(100),
					allowNull: false,
				},
				nickname: {
					type: STRING(30),
					allowNull: false,
				},
				contact: {
					type: STRING,
					unique: true,
				},
				provider: {
					type: ENUM('local', 'kakao', 'google'),
					allowNull: false,
					defaultValue: 'local',
				},
				providerId: {
					type: STRING,
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
	}
}
