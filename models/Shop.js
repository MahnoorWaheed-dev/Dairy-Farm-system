const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopNumber: { type: String, required: true, unique: true },
    personName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    rentDueDate: { type: Number, default: 5 }, // Month ki kis date ko rent due hota hai
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);