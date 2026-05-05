import { Router } from 'express';
import authRoutes from './auth.routes.js';
import cardsRoutes from './cards.routes.js';
import txRoutes from './transactions.routes.js';
import { requireHeader } from '../middleware/requireHeader.js';

const router = Router();

router.use('/auth', authRoutes);

router.use(requireHeader());
router.use('/v3/spend/cards', cardsRoutes);
router.use('/v3/spend/transactions', txRoutes);

export default router;
