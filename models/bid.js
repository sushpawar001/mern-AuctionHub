const mongoose = require('mongoose');

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

        // Find the latest bid for the same product
        const previousBid = await this.constructor
            .findOne({ product: currentBid.product })
            .sort('-amount'); // Retrieve the previous bid, sorting by amount in descending order
        console.log("previousBid: ", previousBid)
        // Check if there is a previous bid and if the current bid amount is greater
        if (previousBid && currentBid.amount <= previousBid.amount) {
            // If the current bid amount is not greater than the previous bid, create an error
            const error = new Error('Bid amount must be greater than the previous bid.');
            return next(error); // Return the error to prevent saving the bid
        }

        // If the conditions are met, proceed to the next middleware or save operation
        next();
    } catch (error) {
        // Handle any errors that occur during the asynchronous operations
        next(error);
    }
});


const bidModel = mongoose.model('bid', bidSchema);
module.exports = bidModel;