const mongoose = require('mongoose');
const productModel = require('./product');

const bidSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    }
}, { timestamps: true });

// Add a pre-save hook to the Bid schema
bidSchema.pre('save', async function (next) {
    try {
        // Capture the current bid document
        const currentBid = this;
        const currentProduct = await productModel.findById(currentBid.product);

        if (currentProduct) {
            // Find the latest bid for the same product
            const previousBid = await this.constructor
                .findOne({ product: currentBid.product })
                .sort('-amount'); // Retrieve the previous bid, sorting by amount in descending order

            if (previousBid && currentBid.amount <= previousBid.amount) {
                const error = new Error('Bid amount must be greater than the previous bid.');
                return next(error);
            }

            if (currentBid.amount < currentProduct.minimunBid) {
                const error = new Error('Bid amount must be greater than minimum bid amount.');
                return next(error);
            }

        } else {
            const error = new Error('No Product found!');
            return next(error);
        }
        next();
    } catch (error) {
        next(error);
    }
});


const bidModel = mongoose.model('bid', bidSchema);
module.exports = bidModel;