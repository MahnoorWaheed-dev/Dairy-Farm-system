const mongoose = require('mongoose');

const rentTransactionSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    year: { 
        type: Number, 
        required: true,
        default: () => new Date().getFullYear() 
    },
    month: { 
        type: String, 
        required: true // e.g. "Jan", "Feb", "Mar"
    },
    receiptNumber: { type: String, required: true, unique: true },
    rentMonth: { type: String, required: true }, // e.g., "August 2026"
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    receivedBy: {
        type: String,
        required: true,
        default: 'Haji Muhammad Ramadan Mangrio'
    }
}, { timestamps: true });


module.exports = mongoose.model('RentTransaction', rentTransactionSchema);