const express = require('express');
const productRouter = express.Router();
const productModel = require("../models/product");

productRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ products })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

productRouter.post('/', async (req, res) => {
    try {
        const product = await productModel.create({ ...req.body });
        res.json({ product });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
})

module.exports = productRouter;