const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const productModel = require('../models/product');
const bidModel = require('../models/bid');
const privateKey = process.env.JWT_PRIVATE_KEY

userRouter.get('/', async (req, res) => {
    const users = await userModel.find({});
    res.json({ "users": users })
})

userRouter.get('/:email', async (req, res) => {
    try {
        const { email } = req.params
        const users = await userModel.find({ email });
        if (users.length) {
            res.json({ "users": users })
        }
    } catch (error) {
        res.json({ 'message': 'No user found!', 'error': error.message })
    }

});

// get user products
userRouter.get('/:email/products/', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userModel.findOne({ email });
        console.log(user)
        if (user) {
            if (user.isSeller) {
                const products = await productModel.find({ seller: user._id });
                res.json({ user, products });
            } else {
                res.json({ message: 'User does not have seller permissions' });
            }
        } else {
            res.json({ message: 'No user found!' });
        }
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error retrieving products', error: error.message });
    }
});

// get bids by user email
userRouter.get('/:email/bids/', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.params.email });
        if (user) {
            const bids = await bidModel.find({ bidder: user._id });
            res.json({ bids })
        } else {
            res.status(400).json({ message: 'No user found!' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


// create a new user
userRouter.post('/signup/', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            const message = existingUser.email === email ? 'User with email already exists!' : 'User with username already exists!';
            return res.status(400).json({ message });
        }

        const hashpass = await bcrypt.hash(password, 12);
        console.log(hashpass)
        const user = await userModel.create({
            username: username,
            password: hashpass,
            email: email
        })

        if (user) {
            return res.json({ 'message': 'New user created', 'user': user });
        }

    } catch (error) {
        res.status(500).json({ 'message': 'Error creating user', 'error': error.message });
    }
})

// verify a user & login
userRouter.post('/login/', async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            res.status(401).json({ "message": "No user found!" });
        }
        const verify = await bcrypt.compare(password, user.password)
        if (verify) {
            // Generate JWT token
            jwt.sign({ userId: user._id }, privateKey, { expiresIn: '1d' }, (err, token) => {
                if (err) {
                    res.status(500).json({ "message": "Error while generating token" });
                }
                res.status(200).json({ user, token })
            })
        }
        else {
            res.status(401).json({ "message": "Invalid password" });
        }

    } catch (error) {
        res.status(500).json({ 'message': 'No data found', 'error': error.message });
    }

})

// update user
userRouter.put('/:email', async (req, res) => {
    const email = req.params.email;
    const data = req.body;
    try {
        const user = await userModel.findOne({ 'email': email });
        // console.log(user);
        if (user) {
            const newUser = await userModel.findByIdAndUpdate(user._id, {
                username: data.username,
                password: data.password,
                email: data.email
            })
            res.json({ 'message': 'User updated!', 'user': newUser });
        }
    } catch (error) {
        console.log(error);
        res.json({ 'message': 'User not updated!' })
    }
});

userRouter.delete('/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await userModel.findOneAndDelete({ email });
        if (user) {
            res.json({ 'message': 'User updated!', 'user': user });
        }
        else {
            res.json({ 'message': 'No User found' });
        }
    } catch (error) {
        res.json({ 'message': 'Error Occured', 'error': error.message });
    }
});

module.exports = userRouter;