import { RequestHandler } from 'express';

export const isLoggedIn: RequestHandler = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		const error = new Error('로그인한 유저만 이용 가능한 서비스입니다.');
		error.status = 401;
		next(error);
	}
};

export const isNotLoggedIn: RequestHandler = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		const error = new Error('로그인한 유저는 이용할 수 없습니다.');
		error.status = 401;
		next(error);
	}
};
