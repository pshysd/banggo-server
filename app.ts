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
import { specs, swaggerUI } from './swagger/swagger';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

/* ROUTES */
import apiRouter from './routes';

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
		console.log('MYSQL connected');
	})
	.catch((err) => {
		console.error(err);
	});

let redisClient = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: +process.env.REDIS_PORT!,
	},
});

redisClient.on('connect', () => console.log('REDIS connected'));
redisClient.on('error', (e) => console.error('REDIS ERROR', e));

redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
	client: redisClient,
	prefix: 'banggo: ',
});

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
		methods: 'GET, POST',
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

/* Routes */
app.get('/', (req, res, next) => {
	res.send('BANGGO API SERVER :)');
});

app.use('/api', apiRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터는 존재하지 않습니다.`);
	error.status = 404;
	next(error);
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const error = err as Error;
	res.status(err.status || 500);
};

app.use(errorHandler);

export default app;
