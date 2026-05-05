import { Router } from 'express';
import { listCards } from '../controllers/cards.controller.js';

const router = Router();

router.get('/', listCards);

export default router;
