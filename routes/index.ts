import express from 'express';
import usersRouter from './users';
import problemsRouter from './problems';
import categoriesRouter from './categories';
import counselingsRouter from './counselings';
import solutionsRouter from './solutions';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: users
 *  description: 유저 관련 API
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

export default router;