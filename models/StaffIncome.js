const mongoose = require('mongoose');

const staffIncomeSchema = new mongoose.Schema({
    sourceTitle: {
        type: String,
        required: true,
        trim: true // e.g., "Scrap Sale", "Machinery Rent", "Extra Income"
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    year: {
        type: String,
        required: true,
        default: () => new Date().getFullYear().toString()
    },
    month: {
        type: String,
        required: true,
        default: () => new Date().toLocaleString('en-US', { month: 'short' })
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('StaffIncome', staffIncomeSchema);