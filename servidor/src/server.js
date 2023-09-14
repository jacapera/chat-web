const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routerApi = require('./routes')
const server = express();

server.disable('x-powered-by');
server.use(express.json());
server.use(morgan('dev'));
//server.use(cors());
server.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
    ]
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)){
        console.log("origin", origin)
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
server.use(express.static('src/uploads'));
routerApi(server);

// Servidor Socket.io
// ---------------------------------------------------
const { createServer } = require('http');
const serverChat = require('./serverChat');
const serverSocket = createServer(server);

serverChat(serverSocket)

module.exports = serverSocket;


