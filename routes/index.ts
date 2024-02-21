import express from 'express';
import authRouter from './auth';
import categoriesRouter from './categories';
import counselingsRouter from './counselings';
import problemsRouter from './problems';
import solutionsRouter from './solutions';
import usersRouter from './users';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: auth
 *  description: 유저 인증 관련 API(검증, 회원가입, 로그인, 로그아웃)
 */
router.use('/auth', authRouter);

/**
 * @swagger
 * tags:
 *  name: users
 *  description: 개인 사용자 데이터 API
 */
router.use('/users', usersRouter);

/**
 * @swagger
 * tags:
 *  name: problems
 *  description: 문제 관련 API
 */
router.use('/problems', problemsRouter);

/**
 * @swagger
 * tags:
 *  name: categories
 *  description: 카테고리 관련 API
 */
router.use('/categories', categoriesRouter);

/**
 * @swagger
 * tags:
 *  name: counselings
 *  description: 문제 관련 API
 */
router.use('/counselings', counselingsRouter);

/**
 * @swagger
 * tags:
 *  name: solutions
 *  description: 문제 관련 API
 */
router.use('/solutions', solutionsRouter);

router.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터는 존재하지 않습니다.`);
	error.status = 404;
	next(error);
});

export default router;
