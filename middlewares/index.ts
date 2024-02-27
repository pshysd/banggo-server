import { RequestHandler } from 'express';
import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';

dotenv.config();

const isLoggedIn: RequestHandler = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		return res.status(401).send('Not Authenticated');
	}
};

const isNotLoggedIn: RequestHandler = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		return res.status(403).send('Already Authenticated');
	}
};

const mailSender = (email: string, title: string, description: string) => {
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

export { isLoggedIn, isNotLoggedIn, mailSender };
