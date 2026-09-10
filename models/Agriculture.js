const mongoose = require('mongoose');

const agricultureSchema = new mongoose.Schema({
    category: { type: String, enum: ['Mango', 'Banana', 'Other'], required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    title: { type: String, required: true }, // e.g., "10 Trees Sale" ya "Fertilizer Expense"
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    year: { type: Number, default: new Date().getFullYear() }
}, { timestamps: true });

module.exports = mongoose.model('Agriculture', agricultureSchema);