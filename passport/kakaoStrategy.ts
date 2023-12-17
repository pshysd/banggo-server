import passport from 'passport';
import { Strategy as kakaoStrategy } from 'passport-kakao';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();

// 카카오 로그인 전략
export default () => {
	passport.use(
		new kakaoStrategy(
			{
				clientID: process.env.KAKAO_ID!,
				callbackURL: '/api/users/kakao/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				console.log('profile._json: ', profile._json);
				try {
					const user = await User.findOne({
						where: { providerId: profile.id, provider: 'kakao' },
					});
					if (user) {
						done(null, user);
					} else {
						const newUser = await User.create({
							email: profile._json && profile._json.kaacount_email,
						});
					}
				} catch (e) {}
			}
		)
	);
};