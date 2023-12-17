const express = require('express');
const productRouter = express.Router();
const productModel = require("../models/product");

productRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ products })
    } catch (error) {
        res.json({ error })
    }
})

productRouter.post('/', async (req, res) => {
    try {
        const product = await productModel.create({ ...req.body });
        res.json({ product });
    } catch (error) {
        console.log(error)
        res.json({ error });
    }
})

module.exports = productRouter;