import passport from 'passport';
import { Strategy as kakaoStrategy } from 'passport-kakao';
import dotenv from 'dotenv';
import User from '../models/user';
import randomNickname from '@woowa-babble/random-nickname';

dotenv.config();

// 카카오 로그인 전략
export default () => {
	passport.use(
		new kakaoStrategy(
			{
				clientID: process.env.KAKAO_KEY!,
				callbackURL: '/api/auth/kakao/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await User.findOne({
						where: { providerId: profile.id, provider: 'kakao' },
					});
					if (user) {
						done(null, user);
					} else {
						const newUser = await User.create({
							email: profile._json && profile._json.account_email,
							nickname: randomNickname.getRandomNickname('animals'),
							providerId: profile.id,
							provider: 'kakao',
						});
					}
				} catch (e) {
					done(e, null);
				}
			}
		)
	);
};
