import Sequelize, { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUID } from 'sequelize';
import Counseling from './counseling';
import Question from './question';
import Answer from './answer';
import SelectedAnswer from './selected-answer';

// 사용자
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<string>;
	declare email: CreationOptional<string>;
	declare password: CreationOptional<string>;
	declare nickname: CreationOptional<string>;
	declare contact: CreationOptional<string>;
	declare provider: CreationOptional<string>;
	declare providerId: CreationOptional<string>;

	static initiate(sequelize: Sequelize.Sequelize) {
		User.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					comment: '유저 고유번호 UUID',
				},
				email: {
					type: Sequelize.STRING(100),
					unique: true,
					allowNull: true,
					comment: '유저 이메일',
				},
				password: {
					type: Sequelize.STRING(100),
					allowNull: true,
					comment: '유저 비밀번호',
				},
				nickname: {
					type: Sequelize.STRING(30),
					allowNull: false,
					comment: '유저 닉네임',
				},
				contact: {
					type: Sequelize.STRING,
					unique: true,
					comment: '유저 연락처',
				},
				provider: {
					type: Sequelize.ENUM('local', 'kakao', 'google'),
					allowNull: false,
					defaultValue: 'local',
					comment: '유저 가입 타입',
				},
				providerId: {
					type: Sequelize.STRING,
					unique: true,
					comment: '소셜 로그인 시 제공받는 providerId',
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
		User.hasMany(SelectedAnswer, { foreignKey: 'userId', sourceKey: 'id' });
	}
}
