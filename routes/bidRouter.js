const express = require('express');
const bidModel = require('../models/bid');
const userModel = require('../models/user');
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
        const bid = await bidModel.create({ ...req.body });
        res.json({ bid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = bidRouter;