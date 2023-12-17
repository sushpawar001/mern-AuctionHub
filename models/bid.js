const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
}, { timestamps: true });

const bidModel = mongoose.model('bid', bidSchema);
module.exports = bidModel;