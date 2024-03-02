/* IMPORTS */
import express, { ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import morgan from 'morgan';
import session from 'express-session';
import { sequelize } from './models';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import passportConfig from './passport';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import './node-schedule';

/* ROUTES */
import apiRouter from './routes';
import path from 'path';

const envPath = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

dotenv.config({
	path: envPath,
});

/* APP */
const app = express();

app.set('PORT', process.env.PORT || 3005);

/* DATABASE */

sequelize
	.sync({ force: false })
	.then(() => {
		console.log('mySQL Connected');
	})
	.catch((err) => {
		console.log('mySQL Connecting Error');
		console.error(err);
	});

const redisPort = parseInt(process.env.REDIS_PORT!);
let redisClient = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: redisPort,
	},
});

redisClient.on('connect', () => console.log('REDIS connected'));
redisClient.on('error', (e) => console.error('REDIS ERROR', e));

redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
	client: redisClient,
	prefix: 'banggo: ',
});

passportConfig();

/* SETTINGS */
if (process.env.NODE_ENV === 'production') {
	app.enable('trust proxy');
	app.use(morgan('combined'));
	app.use(
		helmet({
			contentSecurityPolicy: false,
			crossOriginEmbedderPolicy: false,
			crossOriginResourcePolicy: false,
		})
	);
	app.use(hpp());
} else {
	app.use(morgan('dev'));
}

app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		store: redisStore,
		saveUninitialized: false,
		resave: false,
		secret: process.env.COOKIE_SECRET!,
		cookie: {
			httpOnly: true,
			secure: false,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

/* Routes */
app.get('/', (req, res, next) => {
	res.redirect('/docs');
});

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api', apiRouter);

// 이외의 경로로 접속을 시도할 경우 전부 여기에서 받음
app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터는 존재하지 않습니다.`);
	error.status = 404;
	next(error);
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const error = err as Error;
	console.error(error);

	res.status(err.status || 500);
	res.send(err.message);
};

app.use(errorHandler);

export default app;
