import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import passport from 'passport';
import { auth, logIn, logOut, signUp } from '../controllers/auth';

export const router = express.Router();

router.get('/', auth);

router.get('/kakao', passport.authenticate('kakao'));

router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		failureRedirect: `${process.env.CLIENT_URL}/error?message="로그인 실패"`,
		successRedirect: process.env.CLIENT_URL,
	})
);

/*  구글 로그인 | 회원가입 */
router.get('/google', passport.authenticate('google'));
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${process.env.CLIENT_URL}/error?message="로그인 실패"`,
		successRedirect: process.env.CLIENT_URL,
	})
);

router.post('/', signUp);

/* 사이트 직접 로그인 / 로그아웃 */
router.post('/login', logIn);
router.post('/logout', logOut);

export default router;
