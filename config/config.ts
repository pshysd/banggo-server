import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

dotenv.config({
	path: envPath,
});

export default {
	development: {
		username: process.env.USERNAME!,
		password: process.env.PASSWORD!,
		database: process.env.DB_NAME!,
		host: '127.0.0.1',
		dialect: 'mysql',
	},
	production: {
		username: process.env.USERNAME!,
		password: process.env.PASSWORD!,
		database: process.env.DB_NAME!,
		host: process.env.HOST!,
		dialect: 'mysql',
	},
} as const;
