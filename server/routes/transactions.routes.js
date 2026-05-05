import { Router } from 'express';
import {
  listTransactions,
  updateTransaction,
  updateTransactionCustomFields,
  addReceipt
} from '../controllers/transactions.controller.js';

const router = Router();

router.get('/', listTransactions);
router.put('/:id', updateTransaction);
router.put('/:transactionId/custom-fields', updateTransactionCustomFields);
router.post('/:id/receipts', addReceipt);

export default router;
