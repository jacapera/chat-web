
module.exports = serverSocket => {
  const { Server } = require('socket.io');
  const io = new Server(serverSocket, {cors:{origin:'http://localhost:5173'}});

  // Almacenar clientes que se vayan conectando
  let onLineUsers = [];

  const addNewUser = (userName, socketId) => {
    !onLineUsers.some(user => user.userName === userName) &&
      onLineUsers.push({userName, socketId});
  };

  const removeUser = (socketId) => {
    onLineUsers = onLineUsers.filter(user => user.socketId !== socketId);
  };

  const getUser = (userNameReceptor) => {
    return  onLineUsers.find(user => user.userName === userNameReceptor);
  };


  io.on('connection', socket => {

    // --------- Escuchando cuando se conecte un cliente ----------------
    socket.on("newUser", userName => {
      addNewUser(userName, socket.id);
      console.log('onLineUsers: ', onLineUsers);
    });

    // =============== Chat Individual v2 ================================
    socket.on("private-message",
    ({
      sender_id, receiver_id, userNameReceptor, userNameEmisor,
    }) => {
      console.log("sender_id: ",sender_id, "receiver_id: ", receiver_id)
      const receiver = getUser(userNameReceptor);
      const sender = getUser(userNameEmisor);
      const data = "mensaje-entregado"
      io.to(sender?.socketId).emit("mensaje-recibido", data);
      io.to(receiver?.socketId).emit("mensaje-recibido", data);
    });
    socket.on("disconnect", () => {
      removeUser(socket.id)
    })
  });
}




