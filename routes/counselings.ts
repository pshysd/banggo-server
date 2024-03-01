import express from 'express';
import { isLoggedIn } from '../middlewares';
import { createCounseling, deleteCouseling, getCounselingById, createAIAnswer, updateCounseling } from '../controllers/counselings';

const router = express.Router();

router.get('/:id', getCounselingById);

router.post('/', createCounseling);

router.post('/ai', createAIAnswer);

router.patch('/', updateCounseling);

router.delete('/:id', deleteCouseling);

export default router;
