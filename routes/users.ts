import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import passport from 'passport';
import { auth, signUp, logIn, logOut, updateUser } from '../controllers/users';

export const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/users:
 *   get:
 *    summary: "유저 로그인 인증"
 *    description: "passport 모듈을 사용하여 로그인 되었으면 user 정보, 아니면 false를 반환합니다."
 *    tags: [users]
 *    responses:
 *     "200":
 *      description: 유저 정보
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          users:
 *           type: object
 *           example:
 *            { "id": 1, "email": "honggildong@korea.com" }
 */
router.get('/', auth);

/**
 * @swagger
 * paths:
 *  /api/users/kakao
 *   post:
 *    summary: "카카오 계정으로 로그인 / 회원가입"
 *    tags: [users]
 */
router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		failureRedirect: `${process.env.CLIENT_URL}/error?message="로그인 실패"`,
		successRedirect: process.env.CLIENT_URL,
	})
);

/*  구글 로그인 | 회원가입 */
router.get('/google', isNotLoggedIn, passport.authenticate('google'));
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${process.env.CLIENT_URL}/error?message="로그인 실패"`,
		successRedirect: process.env.CLIENT_URL,
	})
);

/**
 * @swagger
 * paths:
 *
 *  /api/users:
 *   post:
 *    summary: "개인 이메일 회원가입"
 *    description: "POST 요청으로 개인 이메일로 회원가입"
 *    tags: [users]
 *    requestBody:
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          description: "사용자 이메일"
 *         password:
 *          type: string
 *          description: "사용자 비밀번호"
 *         nickname:
 *          type: string
 *          description: "사용자 닉네임(선택사항. 입력하지 않을 경우 자동 생성됩니다.)"
 */
router.post('/', isNotLoggedIn, signUp);

/* 사이트 직접 로그인 / 로그아웃 */
router.post('/login', isNotLoggedIn, logIn);
router.post('/logout', isLoggedIn, logOut);

router.patch('/', updateUser);

export default router;
