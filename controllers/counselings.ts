import { RequestHandler } from 'express';
import Counseling from '../models/counseling';
import Problem from '../models/problem';
import Solution from '../models/solution';
import { sequelize } from '../models';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getCounselingById: RequestHandler = async (req, res, next) => {
	const { id } = req.params;

	try {
		const result = await Counseling.findOne({ where: { id }, include: [Problem, Solution] });

		if (!result) {
			const err = new Error('존재하지 않는 항목입니다.');
			err.status = 404;
			next(err);
		}
		return res.status(200).json(result);
	} catch (e) {
		const err = e as Error;
		console.error(err);
		next(err);
	}
};

const createCounseling: RequestHandler = async (req, res, next) => {
	const body = req.body;
	const { title, category } = req.body;
	/* 
	1. Object.keys(body) => title, category, problem1, ..., solution1, ..., solution5
	2. .filter((key) => key.includes('problem)) => problem1, ..., problem5
	3. .map((key)=> body[key]) => body[problem1], ..., body[problem5]
	 */
	const problems = Object.keys(body)
		.filter((key) => key.includes('problem'))
		.map((key) => body[key]);

	const solutions = Object.keys(body)
		.filter((key) => key.includes('solution'))
		.map((key) => body[key]);

	const user = req.user;

	if (!user) {
		const err = new Error('로그인되지 않은 사용자입니다.');
		err.status = 403;
		return next(err);
	}

	try {
		await sequelize.transaction(async (t) => {
			const createCounseling = await Counseling.create(
				{
					title,
					userId: user.id,
					category,
				},
				{ transaction: t }
			);

			const problemCreationArray = problems.map((problem) => {
				return Problem.create(
					{
						counselingId: createCounseling.id,
						description: problem,
					},
					{ transaction: t }
				);
			});

			const solutionCreationArray = solutions.map((solution) => {
				return Solution.create(
					{
						counselingId: createCounseling.id,
						description: solution,
					},
					{
						transaction: t,
					}
				);
			});

			const result = await Promise.allSettled([createCounseling, ...problemCreationArray, ...solutionCreationArray]);

			if (!result) {
				const err = new Error('콘텐츠를 생성하는 과정에 문제가 발생했습니다.');
				err.status = 400;
				return next(err);
			}

			return res.status(201).json(result[0]);
		});
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		console.error(err);
		next(err);
	}
};

const updateCounseling: RequestHandler = async (req, res, next) => {
	const { id } = req.body;
	const updatedData: Partial<Counseling> = req.body.updatedData;

	try {
		const result = await Counseling.update(updatedData, { where: id });

		if (result) {
			return res.status(200).send('ok');
		}
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		console.error(err);
		next(err);
	}
};

const deleteCouseling: RequestHandler = async (req, res, next) => {
	const { id } = req.params;

	try {
		const result = await Counseling.destroy({ where: { id } });

		if (result) {
			return res.status(200).send('ok');
		} else {
			const err = new Error('삭제할 항목이 존재하지 않습니다.');
			err.status = 204;
			next(err);
		}
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		next(err);
	}
};

const createAIAnswer: RequestHandler = async (req, res, next) => {
	const body = req.body;
	const { title, category, id } = body;

	const problems = Object.keys(body)
		.filter((key) => key.includes('problem'))
		.map((key) => body[key]);

	const solutions = Object.keys(body)
		.filter((key) => key.includes('solution'))
		.map((key) => body[key]);

	if (solutions.length === 0) {
		solutions.push('잘 모르겠습니다.');
	}

	const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const prompt = `안녕하세요. 저는 도움이 필요한 한국인 내담자이고, 당신은 Gemini AI 서비스가 아닌 제가 도움이나 조언이 필요할 때 찾는 한 명의 상담사입니다. 당신은 한국어로 답변을 해야합니다. 상담을 진행하겠습니다.
	제가 조언이 필요한 문제의 분야는 ${category} 입니다.
	제가 고민하고 있는 문제를 한마디로 정의하자면 ${title} 입니다.
	제가 겪고있는 문제는 ${problems.map((problem, index) => {
		return `${index + 1}. ${problem} 입니다.`;
	})}
	이 문제들을 해결하기 위해 제가 떠올린 해결방안은 ${solutions.map((solution, index) => {
		return `${index + 1}. ${solution} 입니다.`;
	})}

	지금까지 제가 갖고있는 문제사항과 해결방안을 말씀드렸습니다. 해결방안을 더 구체화 해주시거나 더 나은 해결방안, 조언이 필요합니다`;
	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;

		const text = response.text();

		if (text) {
			const update = await Counseling.update(
				{
					AIAnswer: text,
				},
				{ where: { id: id } }
			);

			if (update) {
				return res.status(200).send(text);
			}
		}
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		console.error(err);
		next(err);
	}
};

export { getCounselingById, createCounseling, updateCounseling, deleteCouseling, createAIAnswer };
