const express = require('express');
const router = express.Router();
const userRouter = require('./user.router');
const transactionRouter = require('./transaction.router');

// Main API routes
router.use('/users', userRouter);
router.use('/transactions', transactionRouter);

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Financial Management API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            transactions: '/api/transactions'
        }
    });
});

module.exports = router;