import express from 'express';
import authRouter from './auth';
import categoriesRouter from './categories';
import counselingsRouter from './counselings';
import problemsRouter from './problems';
import solutionsRouter from './solutions';
import usersRouter from './users';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', usersRouter);

router.use('/problems', problemsRouter);

router.use('/categories', categoriesRouter);

router.use('/counselings', counselingsRouter);

router.use('/solutions', solutionsRouter);

router.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터는 존재하지 않습니다.`);
	error.status = 404;
	next(error);
});

export default router;
