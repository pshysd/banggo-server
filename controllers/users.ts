import { RequestHandler } from 'express';
import Counseling from '../models/counseling';
import User from '../models/user';

// 상담기록, 마이페이지 등
const getCounselingsByUserId: RequestHandler = async (req, res, next) => {
	const { id } = req.params; // userId
	const query = req.query; // 쿼리 파라미터

	// 쿼리스트링이 존재할 경우
	if (query.limit && query.limit === 'string') {
		const limit = parseInt(query.limit, 10);
		if (!isNaN(limit)) {
			try {
				const counselings = await Counseling.findAll({
					where: { userId: id },
					order: [['updatedAt', 'DESC']],
					limit: limit,
				});
				if (counselings.length === 0) {
					return res.status(204).json(null);
				}
				return res.status(200).json(counselings);
			} catch (e) {
				const err = e as Error;
				err.status = 400;
				err.message = '유저 고민 정보를 가져오는 도중에 알 수 없는 에러가 발생했습니다.';
			}
		} else {
			const err = new Error('가져올 데이터의 갯수에 잘못된 값이 입력됐습니다.');
			err.status = 400;
			next(err);
		}
		// 쿼리 스트링이 존재하지 않을 경우
	} else {
		try {
			const counselings = await Counseling.findAll({
				where: { userId: id },
				order: [['updatedAt', 'DESC']],
			});
			if (counselings.length !== 0) {
				return res.status(200).json(counselings);
			} else {
				return res.status(204).json(null);
			}
		} catch (e) {
			const err = e as Error;
			err.status = 400;
			err.message = '유저 고민 정보를 가져오는 도중에 알 수 없는 에러가 발생했습니다.';
			next(err);
		}
	}
};

// 마이페이지에서 조회
const getQuestionByUserId: RequestHandler = async (req, res, next) => {
	const { id } = req.body;

	try {
		const err = new Error('아직 구현되지 않은 기능입니다.');
		err.status = 501;
		next(err);
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '질문을 가져오는 도중에 알 수 없는 에러가 발생했습니다.';
		next(err);
	}
};

const updateUser: RequestHandler = async (req, res, next) => {
	const { updatedData } = req.body;
	const user = req.user;

	if (!user) {
		const err = new Error('is not loggedIn.');
		err.status = 401;
		return next(err);
	}

	try {
		const result = await user.update(updatedData, { where: { id: user.id } });

		return res.status(204).json(result);
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '유저를 삭제하는 도중에 알 수 없는 에러가 발생했습니다.';
		next(err);
	}
};

const deleteUser: RequestHandler = async (req, res, next) => {
	try {
		const user = req.user;

		if (!user) {
			const err = new Error('로그인되지 않은 유저입니다.');
			err.status = 400;
			return next(err);
		}

		// 회원 탈퇴(soft delete)
		const result = await User.destroy({ where: { id: user.id } });

		if (!result) {
			const err = new Error('회원탈퇴를 진행하는 도중에 문제 발생함');
			err.status = 500;
			return next(err);
		}

		// 로그아웃 처리
		req.logout((err) => {
			if (err) return next(err);
			req.session.destroy(() => {
				res.clearCookie('connect.sid', {
					httpOnly: true,
				});
			});
			return res.status(200).send('회원 탈퇴 처리 완료');
		});
	} catch (e) {
		const err = e as Error;
		err.status = 400;
		err.message = '유저를 삭제하는 도중에 알 수 없는 에러가 발생했습니다.';
		next(err);
	}
};

export { getCounselingsByUserId, getQuestionByUserId, updateUser, deleteUser };
