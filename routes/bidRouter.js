const express = require('express');
const bidModel = require('../models/bid');
const bidRouter = express.Router();

bidRouter.get('/', async (req, res) => {
    try {
        const bids = await bidModel.find({})
        res.json({ bids })
    } catch (error) {
        res.json({ error })
    }
})

bidRouter.post('/', async (req, res) => {
    try {
        const bid = await bidModel.create({ ...req.body });
        res.json({ bid });
    } catch (error) {
        console.log(error)
        res.json({ error });
    }
})

module.exports = bidRouter;