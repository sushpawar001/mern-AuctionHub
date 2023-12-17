const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const productModel = require('../models/product');
const privateKey = process.env.JWT_PRIVATE_KEY

userRouter.get('/', async (req, res) => {
    const users = await userModel.find({});
    res.json({ "users": users })
})

userRouter.get('/:email', async (req, res) => {
    try {
        const email = req.params.email
        const users = await userModel.find({ email });
        if (users.length) {
            res.json({ "users": users })
        }
    } catch (error) {
        res.json({ 'message': 'No user found!', 'error': error })
    }

});

// get user products
userRouter.get('/:email/products/', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userModel.findOne({ email });

        if (user) {
            if (user.isSeller) {
                console.log('Seller')
                const products = await productModel.find({ seller: user._id }).populate('seller');
                res.json({ user, products });
            } else {
                res.json({ message: 'User does not have seller permissions' });
            }
        } else {
            res.json({ message: 'No user found!' });
        }
    } catch (error) {
        res.json({ message: 'Error retrieving products', error });
    }
});


// create a new user
userRouter.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashpass = await bcrypt.hash(password, 12);
        console.log(hashpass)
        const user = await userModel.create({
            username: username,
            password: hashpass,
            email: email
        })

        if (user) {
            res.json({ 'message': 'New user created', 'user': user });
        }

    } catch (error) {
        res.json({ 'message': 'No data found', 'error': error });
    }
})

// verify a user & login
userRouter.post('/login/', async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await userModel.findOne({ email: email })
        if (!user) res.status(401).json({ "message": "No user found!" });
        const verify = await bcrypt.compare(password, user.password)
        if (verify) {
            // Generate JWT token
            jwt.sign({ userId: user._id }, privateKey, { expiresIn: '1d' }, (err, token) => {
                if (err) res.status(500).json({ "message": "Error while generating token" });
                res.status(200).json({ user, token })
            })
        }
        else res.status(401).json({ "message": "Invalid password" });

    } catch (error) {
        res.status(500).json({ 'message': 'No data found', 'error': error });
    }

})

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
        res.json({ 'message': 'Error Occured', 'error': error });
    }
});

module.exports = userRouter;