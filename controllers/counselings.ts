import { RequestHandler } from 'express';
import Counseling from '../models/counseling';
import Problem from '../models/problem';
import Solution from '../models/solution';
import { sequelize } from '../models';

export const getCounselingById: RequestHandler = async (req, res, next) => {
	const { id } = req.body;

	try {
		const result = await Counseling.findByPk(id, {
			include: [Problem, Solution],
		});

		if (result) return res.status(200).json(result);
	} catch (e) {
		const err = e as Error;
		console.error(err);
		next(err);
	}
};

export const getCounselingsByUser: RequestHandler = async (req, res, next) => {
	const { userId } = req.body;

	try {
		const result = await Counseling.findAll({
			where: { userId },
			include: [
				{ model: Problem, attributes: ['description'] },
				{ model: Solution, attributes: ['description'] },
			],
			order: [['createdAt', 'DESC ']],
		});

		if (result) return res.status(200).json(result);
	} catch (e) {
		const err = e as Error;
		console.error(err);
		next(err);
	}
};

export const createCounseling: RequestHandler = async (req, res, next) => {
	try {
		await sequelize.transaction();
	} catch (e) {
		const err = e as Error;
		console.error(err);
		next(err);
	}
};
