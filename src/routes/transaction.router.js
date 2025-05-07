const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All transaction routes require authentication
router.use(authenticate);

router.post('/', TransactionController.createTransaction);
router.get('/', TransactionController.getTransactions);
router.get('/:id', TransactionController.getTransaction);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;