const express = require('express');
const usersRouter = require('./usersRouter');
const messagesRouter = require('./messagesRouter');
const chatsRouter = require('./chatsRouter');

function routerApi(server) {
  const router = express.Router();

  //Ruta padre con versión
  server.use("/api/v1", router);

  router.use("/users", usersRouter);
  router.use("/messages", messagesRouter);
  router.use("/chats", chatsRouter);
};

module.exports = routerApi;