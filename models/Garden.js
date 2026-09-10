const mongoose = require('mongoose');

const gardenTransactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['INCOME', 'EXPENSE'], // INCOME = Fasal Sale, EXPENSE = Khad/Worker/Transport
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    }
});

const gardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cropType: {
        type: String,
        enum: ['Mango', 'Banana', 'Other'],
        required: true
    },
    areaSize: {
        type: String // e.g. "10 Acres"
    },
    transactions: [gardenTransactionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Garden', gardenSchema);