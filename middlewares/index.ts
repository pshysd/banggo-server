import { RequestHandler } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

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

export const translator: RequestHandler = async (req, res, next) => {
	const papagoURL = 'https://openapi.naver.com/v1/papago/n2mt';

	// 쿼리 받아오는 부분 채워야 함
	let query = '';

	const data = {
		source: 'en',
		target: 'ko',
		text: query,
	};

	const options = {
		headers: { 'X-Naver-Client-Id': process.env.PAPAGO_CLIENT, 'X-Naver-Client-Secret': process.env.PAPAGO_CLIENT_SECRET },
	};

	const translatedData = await axios.post(papagoURL, data, options);

	return translatedData;
};
