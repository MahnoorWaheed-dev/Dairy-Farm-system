const mongoose = require('mongoose');
const gardenSchema = new mongoose.Schema({
    gardenName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    areaSize: {
        type: String,
        trim: true
    },
    cropType: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Available', 'On Lease'],
        default: 'Available'
    },
    // Active Lease Details
    currentLease: {
        contractor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person'
        },
        contractorName: String, // Custom / Direct Thekedar Name
        startDate: Date,
        endDate: Date,
        totalAmount: Number,
        advanceAmount: Number,
        notes: String
    }
}, { timestamps: true });
module.exports = mongoose.model('Garden', gardenSchema);