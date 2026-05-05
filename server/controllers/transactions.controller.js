import path from 'path';
import { fileURLToPath } from 'url';
import { loadJSON, saveJSON } from '../utils/jsonStore.js';
import { decodeToken, encodeToken } from '../utils/tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transactionsPath = path.join(__dirname, '..', 'mock_data', 'transactions.json');
const receiptsPath = path.join(__dirname, '..', 'mock_data', 'receipts.json');

export const listTransactions = (req, res, next) => {
  try {
    let transactions = loadJSON(transactionsPath);

    // Filtering
    if (req.query.userId) {
      transactions = transactions.filter(t => t.userId === req.query.userId);
    }
    if (req.query.complete) {
      const completeBool = req.query.complete === 'true';
      transactions = transactions.filter(t => t.complete === completeBool);
    }

    // Sorting: sort=field:asc|desc
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      if (field && order && ['asc', 'desc'].includes(order.toLowerCase())) {
        transactions.sort((a, b) => {
          if (a[field] < b[field]) return order.toLowerCase() === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return order.toLowerCase() === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    // Pagination
    const max = Math.min(parseInt(req.query.max) || 20, 50);

    let startIndex = 0;
    if (req.query.nextPage) {
      const decodedId = decodeToken(req.query.nextPage);
      startIndex = transactions.findIndex(c => c.uuid === decodedId) + 1;
      if (startIndex < 0) startIndex = 0;
    } else if (req.query.prevPage) {
      const decodedId = decodeToken(req.query.prevPage);
      startIndex = transactions.findIndex(c => c.uuid === decodedId) - max;
      if (startIndex < 0) startIndex = 0;
    }
    startIndex = Math.min(Math.max(0, startIndex), transactions.length);

    const paged = transactions.slice(startIndex, startIndex + max);
    const lastTx = paged[paged.length - 1];
    const firstTx = paged[0];

    const nextPage = (startIndex + max) < transactions.length && lastTx ? encodeToken(lastTx.uuid) : null;
    const prevPage = startIndex > 0 && firstTx ? encodeToken(firstTx.uuid) : null;

    res.json({ nextPage, prevPage, transactions: paged });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = (req, res, next) => {
  try {
    const transactions = loadJSON(transactionsPath);
    const index = transactions.findIndex(t => t.uuid === req.params.id);

    if (index === -1) {
      const err = new Error('Transaction not found');
      err.status = 404;
      err.reason = 'Transaction not found';
      err.severity = 'INFORMATION';
      err.category = 'REQUEST';
      err.description = `Transaction not found: ${req.params.id}`;
      return next(err);
    }

    transactions[index] = { ...transactions[index], ...req.body };
    saveJSON(transactionsPath, transactions);
    res.json(transactions[index]);
  } catch (err) {
    next(err);
  }
};

export const updateTransactionCustomFields = (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { customFields } = req.body;

    const transactions = loadJSON(transactionsPath);
    const txIndex = transactions.findIndex(tx => tx.uuid === transactionId);

    if (txIndex === -1) {
      const err = new Error('Transaction not found');
      err.status = 404;
      err.reason = 'Transaction not found';
      err.severity = 'INFORMATION';
      err.category = 'REQUEST';
      err.description = `Transaction not found: ${transactionId}`;
      return next(err);
    }

    const transaction = transactions[txIndex];

    if (!Array.isArray(transaction.customFields)) {
      transaction.customFields = [];
    }

    (customFields || []).forEach(updateCF => {
      const { customFieldId, selectedValues, note } = updateCF || {};
      if (!customFieldId || typeof customFieldId !== 'string') return;

      const existingIndex = transaction.customFields.findIndex(cf => cf.uuid === customFieldId);

      if (existingIndex === -1) {
        transaction.customFields.push({
          uuid: customFieldId,
          name: null,
          isRequired: false,
          selectedValues: Array.isArray(selectedValues) ? selectedValues : [],
          note: typeof note === 'string' ? note : null
        });
      } else {
        if (Array.isArray(selectedValues)) {
          transaction.customFields[existingIndex].selectedValues = selectedValues;
        }
        if (typeof note === 'string') {
          transaction.customFields[existingIndex].note = note;
        }
      }
    });

    saveJSON(transactionsPath, transactions);
    res.json({ status: 'SUCCESS' });
  } catch (err) {
    next(err);
  }
};

export const addReceipt = (req, res, next) => {
  try {
    const receipts = loadJSON(receiptsPath);
    const newReceipt = {
      uuid: `${Date.now()}`,
      transactionId: req.params.id,
      ...req.body
    };
    receipts.push(newReceipt);
    saveJSON(receiptsPath, receipts);

    res.status(201).json({
      url: req.body.url,
      filename: req.body.filename,
      uuid: newReceipt.uuid
    });
  } catch (err) {
    next(err);
  }
};