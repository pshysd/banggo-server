import { RequestHandler } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import nodeMailer from 'nodemailer';

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

export const mailSender = (email: string, title: string, description: string) => {
	const transporter = nodeMailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_ID,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const html = `<h1>회원가입이 완료되었습니다! 환영합니다!</h1><br /><p>${description}</p><br /><b>이 메일은 백엔드 서버 개발자의 개인 프로젝트 용으로 발송된 메일이며 악의적 용도가 없음을 알려드립니다. 감사합니다.</b>`;
	const mailOptions = {
		from: process.env.EMAIL_ID,
		to: email,
		subject: title,
		html,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.error(err);
		} else {
			console.log('Email Sent: ', info);
		}
	});
};
