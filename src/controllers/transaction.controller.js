const Transaction = require('../models/transaction.model');

/**
 * Transaction Controller
 * Handles all transaction-related operations
 */
class TransactionController {
    /**
     * Create a new transaction
     * @route POST /transactions
     */
    static async createTransaction(req, res) {
        try {
            const { type, amount, category, date, description, paymentMethod } = req.body;
            
            // Create transaction with user ID from authenticated user
            const transaction = new Transaction({
                userId: req.user.id, // Using userId to match the model
                type,
                amount,
                category,
                date: date || new Date(),
                description,
                paymentMethod: paymentMethod || 'Tunai'
            });
            
            const savedTransaction = await transaction.save();
            
            res.status(201).json({
                success: true,
                data: savedTransaction
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    /**
     * Get all transactions with optional filters
     * @route GET /transactions
     */
    static async getTransactions(req, res) {
        try {
            const { type, startDate, endDate, category } = req.query;
            
            // Build filter object
            const filter = { userId: req.user.id }; // Using userId to match the model
            
            if (type) filter.type = type;
            if (category) filter.category = category;
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate);
                if (endDate) filter.date.$lte = new Date(endDate);
            }
            
            const transactions = await Transaction.find(filter).sort({ date: -1 });
            
            res.status(200).json({
                success: true,
                count: transactions.length,
                data: transactions
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    /**
     * Get a single transaction by ID
     * @route GET /transactions/:id
     */
    static async getTransaction(req, res) {
        try {
            const transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            
            // Check if transaction belongs to user
            if (transaction.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to access this transaction'
                });
            }
            
            res.status(200).json({
                success: true,
                data: transaction
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    /**
     * Update a transaction
     * @route PUT /transactions/:id
     */
    static async updateTransaction(req, res) {
        try {
            let transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            
            // Check if transaction belongs to user
            if (transaction.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this transaction'
                });
            }
            
            transaction = await Transaction.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
            
            res.status(200).json({
                success: true,
                data: transaction
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    /**
     * Delete a transaction
     * @route DELETE /transactions/:id
     */
    static async deleteTransaction(req, res) {
        try {
            const transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            
            // Check if transaction belongs to user
            if (transaction.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this transaction'
                });
            }
            
            await transaction.deleteOne();
            
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
}

module.exports = TransactionController;