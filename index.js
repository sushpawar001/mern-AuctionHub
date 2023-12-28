const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const bidRouter = require('./routes/bidRouter');
const cors = require('cors')
const socketIo = require('socket.io');
const app = express();
const http = require('http');
const port = process.env.PORT
const server = http.createServer(app);
const io = socketIo(server, {
    path: '/ws', cors: {
        origin: '*'
    }
});


// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use('/users', userRouter);
app.use('/prod', productRouter);
app.use('/bid', bidRouter);

app.get('/', (req, res) => {
    res.send('<h1>This is Homepage!</h1>')
})

io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle socket events as needed
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB")
        server.listen(port, () => {
            console.log(`listening on port http://localhost:${port}`);
        })
    })
    .catch((err) => {
        console.log("error occurred while connecting to Mongo", err);
    })
