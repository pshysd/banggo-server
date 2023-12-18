import passport from 'passport';
import { Strategy as googleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/user';
import randomNickname from '@woowa-babble/random-nickname';

dotenv.config();

export default () => {
	passport.use(
		new googleStrategy(
			{
				clientID: process.env.GOOGLE_KEY!,
				clientSecret: process.env.GOOGLE_SECRET!,
				callbackURL: '/api/users/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await User.findOne({ where: { providerId: profile.id, provider: 'google' } });

					if (!user) {
						const newAccount = await User.create({
							email: profile._json && profile._json.email!,
							nickname: randomNickname.getRandomNickname('animals'),
							providerId: profile.id,
							provider: 'google',
						});
						done(null, newAccount);
					} else {
						done(null, user);
					}
				} catch (e) {
					const err = e as Error;
					console.error(err);
					done(err);
				}
			}
		)
	);
};
