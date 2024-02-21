import { RequestHandler } from 'express';
import passport from 'passport';
import User from '../models/user';
import bcrypt from 'bcrypt';
import randomNickname from '@woowa-babble/random-nickname';
import { mailSender } from '../middlewares';

const auth: RequestHandler = async (req, res, next) => {
	// 단축 평가로 req.user가 truthy일 경우 req.user, 아닐 경우 false를 반환한다.
	return await res.status(200).json(req.user || false);
};

const signUp: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;
	const nickname = req.body.nickname || randomNickname.getRandomNickname('animals');

	try {
		const exUser = await User.findOne({ where: { email } });

		if (exUser) return res.status(400).send('이미 존재하는 이메일입니다.');

		const hash = await bcrypt.hash(password, 12);

		const user = await User.create({
			email,
			password: hash,
			nickname,
		});

		if (user) {
			mailSender(email, '방고 서비스에 가입하신 것을 환영합니다!', `${new Date()}에 가입하셨습니다.`);
			return res.status(201).json(user);
		}
	} catch (e) {
		console.error(e);
		return next(e);
	}
};

const logIn: RequestHandler = (req, res, next) => {
	passport.authenticate('local', (err: Error, user: Express.User) => {
		if (err) return next(err);

		if (user) {
			return req.login(user, (err) => {
				if (err) return next(err);
				return res.status(200).json(user);
			});
		} else {
			return res.status(404).send('존재하지 않는 사용자입니다.');
		}
	})(req, res, next);
};

const logOut: RequestHandler = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		return res.status(200).send('ok');
	});
};

const updateUser: RequestHandler = (req, res, next) => {};
const deleteUser: RequestHandler = (req, res, next) => {};

export { auth, signUp, logIn, logOut, updateUser, deleteUser };
