const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const bidRouter = require('./routes/bidRouter');
const cors = require('cors')
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT
const http = require('http');
const server = http.createServer(app);

// Websocket
const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});


// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// routers
app.use('/users', userRouter);
app.use('/prod', productRouter);
app.use('/bid', bidRouter);

app.get('/', (req, res) => {
    res.send('<h1>This is Homepage!</h1>')
})

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //sends the message to all the users on the server
    io.emit('messageResponse', 'Hello');

    socket.on('disconnect', () => {
        console.log(`🔥: ${socket.id} user disconnected`);
    });
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
