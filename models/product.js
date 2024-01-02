const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    minimumBid: {
        type: Number,
        required: true
    },
    currentBid: {
        type: Number,
        default: function () {
            return this.minimumBid;
        }
    },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bid' }],
    startingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true,
        default: function () {
            const startDate = new Date(this.startingDate);
            startDate.setDate(startDate.getDate() + 7);
            return startDate;
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;