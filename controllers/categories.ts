import { RequestHandler } from 'express';
import Category from '../models/category';

export const getCategories: RequestHandler = async (req, res, next) => {
	try {
		const categories = await Category.findAll();

		return res.status(200).json(categories);
	} catch (e) {
		const error = e as Error;
		error.status = 400;
		error.message = '카테고리 불러오는 도중 에러가 발생함';
		next(error);
	}
};
