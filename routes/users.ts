import express from 'express';
import { isLoggedIn } from '../middlewares';
import { getCounselingsByUserId } from '../controllers/users';

export const router = express.Router();

router.get('/counselings/:id', isLoggedIn, getCounselingsByUserId);

export default router;
