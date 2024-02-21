import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({
	path: envPath,
});

export default {
	development: {
		username: process.env.USERNAME!,
		password: process.env.PASSWORD!,
		database: process.env.DB_NAME!,
		host: process.env.HOST!,
		dialect: 'mysql',
		logging: false,
		timezone: '+09:00',
	},
	production: {
		username: process.env.USERNAME!,
		password: process.env.PASSWORD!,
		database: process.env.DB_NAME!,
		host: process.env.HOST!,
		dialect: 'mysql',
		port: +process.env.DB_PORT!,
		timezone: '+09:00',
	},
} as const;
