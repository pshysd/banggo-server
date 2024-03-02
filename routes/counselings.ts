import express from 'express';
import { isLoggedIn } from '../middlewares';
import { createCounseling, deleteCouseling, getCounselingById, createAIAnswer, updateCounseling } from '../controllers/counselings';

const router = express.Router();

router.get('/:id', isLoggedIn, getCounselingById);

router.post('/', isLoggedIn, createCounseling);

router.post('/ai', isLoggedIn, createAIAnswer);

router.patch('/', isLoggedIn, updateCounseling);

router.delete('/:id', isLoggedIn, deleteCouseling);

export default router;
