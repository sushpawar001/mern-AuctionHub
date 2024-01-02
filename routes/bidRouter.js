const express = require('express');
const bidModel = require('../models/bid');
const userModel = require('../models/user');
const productModel = require('../models/product');
const { emitSocketEvent } = require('../sockets');
const bidRouter = express.Router();

bidRouter.get('/', async (req, res) => {
    try {
        const bids = await bidModel.find({})
        res.json({ bids })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// get all bids by product
bidRouter.get('/:prod', async (req, res) => {
    try {
        const product = req.params.prod;
        const bids = await bidModel.find({ product });
        res.json({ bids })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

bidRouter.post('/', async (req, res) => {
    try {
        const { product } = req.body;
        const existingProduct = await productModel.findById(product)
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const bid = await bidModel.create({ ...req.body });
        existingProduct.bids.push(bid);
        existingProduct.currentBid = bid.amount;
        await existingProduct.save();
        console.log(bid);
        emitSocketEvent(req, 'bidUpdate', bid);
        res.json({ bid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = bidRouter;