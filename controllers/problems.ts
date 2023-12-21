import { RequestHandler } from 'express';

export const createProblems: RequestHandler = async (req, res, next) => {
	const { problems } = req.body;
};
