const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routerApi = require('./routes')
const server = express();


server.use(express.json());
server.use(morgan('dev'));
server.use(cors());
server.use(express.static('src/uploads'));
routerApi(server);

// Servidor Socket.io
// ---------------------------------------------------
const { createServer } = require('http');
const serverChat = require('./serverChat');
const serverSocket = createServer(server);

serverChat(serverSocket)

module.exports = serverSocket;


