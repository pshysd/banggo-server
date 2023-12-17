import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user';

// 개인 이메일 로그인 전략
export default () => {
	passport.use(
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

					// 이메일 있을 경우
					if (user) {
						// DB의 비밀번호와 필드로 받은 비밀번호 일치하는지 검사
						const compare = await bcrypt.compare(password, user.password);

						// 일치할 경우
						if (compare) {
							// 에러 없음, user 리턴
							done(null, user);
						} else {
							// 에러 없음, user:false 리턴, 옵션으로 비밀번호 일치하지 않음 리턴
							done(null, false, { message: '비밀번호가 일치하지 않습니다' });
						}
						// 이메일 없을 경우
					} else {
						done(null, false, { message: '가입되지 않은 회원입니다.' });
					}
				} catch (e) {
					// 에러 잡힐 경우 에러 리턴
					done(e);
				}
			}
		)
	);
};
