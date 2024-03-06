import express from 'express';
import { isLoggedIn } from '../middlewares';
import { deleteUser, getCounselingsByUserId, updateUser } from '../controllers/users';

export const router = express.Router();

router.get('/counselings/:id', isLoggedIn, getCounselingsByUserId);

router.patch('/', isLoggedIn, updateUser);

router.delete('/', isLoggedIn, deleteUser);

export default router;
