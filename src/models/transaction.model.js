const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Transaction Schema
 * Represents a financial transaction made by a user.
 */
const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'Tunai'
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Transaction', transactionSchema);