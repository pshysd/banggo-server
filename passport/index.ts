import passport from 'passport';
import User from '../models/user';
import local from './localStrategy';
import kakao from './kakaoStrategy';
import google from './googleStrategy';

export default () => {
	// req.login()시에 호출됨
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id: number, done) => {
		try {
			const user = await User.findByPk(id);

			return done(null, user);
		} catch (e) {
			const err = e as Error;
			done(err);
		}
	});

	local();
	kakao();
	google();
};
