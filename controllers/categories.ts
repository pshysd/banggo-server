import { RequestHandler } from 'express';
import Category from '../models/category';

export const getCategories: RequestHandler = async (req, res, next) => {
	try {
		const categories = await Category.findAll();

		return res.status(200).json(categories);
	} catch (e) {
		const error = e as Error;
		error.status = 400;
		error.message = 'Error occurred in getCategories';
		next(error);
	}
};
