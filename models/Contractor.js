const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    mobile: { 
        type: String,
        trim: true 
    },
    cnic: { 
        type: String,
        trim: true 
    },
    address: { 
        type: String,
        trim: true 
    },
    currentBalance: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Contractor', contractorSchema);