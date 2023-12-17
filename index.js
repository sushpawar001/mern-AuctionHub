const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const bidRouter = require('./routes/bidRouter');
const app = express();
const port = process.env.PORT

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use('/users', userRouter);
app.use('/prod', productRouter);
app.use('/bid', bidRouter);

app.get('/', (req, res) => {
    res.send('<h1>This is Homepage!</h1>')
})


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(port, () => {
            console.log(`listening on port http://localhost:${port}`);
        })
    })
    .catch((err) => {
        console.log("error occurred while connecting to Mongo", err);
    })
