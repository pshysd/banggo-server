import { RequestHandler } from 'express';
import passport from 'passport';
import User from '../models/user';
import bcrypt from 'bcrypt';
import randomNickname from '@woowa-babble/random-nickname';

const auth: RequestHandler = (req, res, next) => {
	// 단축 평가로 req.user가 truthy일 경우 req.user, 아닐 경우 false를 반환한다.
	return res.json(req.user || false);
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

		if (user) return res.status(201).send(user);
	} catch (e) {
		console.error(e);
		return next(e);
	}
};

const logIn: RequestHandler = (req, res, next) => {
	passport.authenticate('local', (err: Error, user: Express.User) => {
		if (err) return next(err);

		if (!user) return res.status(404).send('존재하지 않는 사용자입니다.');

		return req.login(user, (err) => {
			if (err) return next(err);
			return res.status(200).json(user);
		});
	})(req, res, next);
};

const logOut: RequestHandler = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.send('ok');
	});
};

const updateUser: RequestHandler = (req, res, next) => {};

export { auth, signUp, logIn, logOut, updateUser };
