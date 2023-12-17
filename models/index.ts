/* IMPORTS */
import Sequelize from 'sequelize';
import configObj from '../config/config';
import dotenv from 'dotenv';

dotenv.config();

/* ENTITIES */
import User from './user';
import Category from './category';
import Counseling from './counseling';
import Problem from './problem';
import Solution from './solution';

const env = (process.env.NODE_ENV as 'production') || 'development';
const config = configObj[env];

export const sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);

User.initiate(sequelize);
Category.initiate(sequelize);
Counseling.initiate(sequelize);
Problem.initiate(sequelize);
Solution.initiate(sequelize);

User.associate();
Category.associate();
Counseling.associate();
Problem.associate();
Solution.associate();
