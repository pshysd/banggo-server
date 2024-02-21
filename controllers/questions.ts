import { RequestHandler } from 'express';
import Question from '../models/question';
import SelectedAnswer from '../models/selected-answer';

// 기본 조회
const getQuestionById: RequestHandler = async (req, res, next) => {
	const { id } = req.body;
	try {
		const question = await Question.findByPk(id, { include: [SelectedAnswer] });

		// 게시글 존재하지 않을 경우
		if (!question) {
			const err = new Error('존재하지 않는 게시글입니다.');
			err.status = 404;
			return next(err);
		}

		question.views++;
		const result = await question.save();

		// DB에서 수정하던 도중에 에러가 발생했을 경우
		if (!result) {
			const err = new Error('조회수를 증가시키는 도중 에러가 발생했습니다.');
			err.status = 500;
			return next(err);
		}
	} catch (e) {
		const err = e as Error;
		err.message = '질문을 가져오는 도중에 알 수 없는 에러가 발생했습니다.';
		err.status = 400;
		next(err);
	}
};

// 게시글 생성
const createQuestion: RequestHandler = async (req, res, next) => {
	const { id } = req.body;
	try {
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '게시글을 작성하는 도중에 알 수 없는 에러가 발생했습니다.';
		next(err);
	}
};

// 게시글 수정
const updateQuestion: RequestHandler = async (req, res, next) => {
	const { id, updatedQuestion } = req.body;

	try {
		const question = await Question.findByPk(id);

		if (!question) {
			const err = new Error('존재하지 않는 게시글에 요청을 보냈습니다.');
			err.status = 404;
			return next(err);
		}

		const result = await question.update(updatedQuestion);

		if (!result) {
			const err = new Error('게시글을 수정하는 도중에 에러가 발생헀습니다.');
			err.status = 500;
			return next(err);
		}

		return res.status(205).json(question);
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '질문을 수정하는 도중에 알 수 없는 에러가 발생했습니다.';
	}
};

// 게시글 삭제(soft delete)
const deleteQuestion: RequestHandler = async (req, res, next) => {
	const { id } = req.body;

	try {
		const result = await Question.destroy({
			where: {
				id: id,
			},
		});

		if (!result) {
			const err = new Error('존재하지 않는 게시글에 요청을 보냈습니다.');
			err.status = 404;
			return next(err);
		}

		return res.status(200).send(`${id}번 게시글 삭제 완료`);
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '질문을 삭제하는 도중에 알 수 없는 에러가 발생했습니다.';
	}
};

export { getQuestionById, createQuestion, updateQuestion, deleteQuestion };
