import { RequestHandler } from 'express';
import Category from '../models/category';

export const getCategories: RequestHandler = async (req, res, next) => {
	try {
		const categories = await Category.findAll();

		if (!categories) {
			const err = new Error('카테고리가 존재하지 않습니다.');
			err.status = 400;
			return next(err);
		}

		return res.status(200).json(categories);
	} catch (e) {
		const error = e as Error;
		error.status = 400;
		error.message = '카테고리 불러오는 도중 에러가 발생함';
		next(error);
	}
};
