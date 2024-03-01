import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user';

// 개인 이메일 로그인 전략
export default () => {
	passport.use(
		'local',
		new localStrategy(
			{
				// form에서 받아올 필드명 지정
				usernameField: 'email',
				passwordField: 'password',
			},
			async (email, password, done) => {
				try {
					// 받은 필드와 일치하는 이메일 있는지 확인
					const user = await User.findOne({ where: { email } });

					// 일치하는 유저 없을 경우
					if (!user) {
						return done(null, false, { message: '존재하지 않는 회원입니다.' });
					}

					// 이메일 있을 경우
					// DB의 비밀번호와 필드로 받은 비밀번호 일치하는지 검사
					const compare = await bcrypt.compare(password, user.password);

					// 비밀번호 일치하지 않을 경우
					if (!compare) {
						return done(null, false, { message: '비밀번호가 일치하지 않습니다' });
					}

					// 일치할 경우 에러 없음, user 리턴
					return done(null, user);
				} catch (e) {
					// 에러 잡힐 경우 에러 리턴
					return done(e);
				}
			}
		)
	);
};
