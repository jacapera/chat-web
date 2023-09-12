
module.exports = serverSocket => {
  const { Server } = require('socket.io');
  const io = new Server(serverSocket, {cors:{origin:'http://localhost:5173'}});

  // Almacenar clientes que se vayan conectando
  let onLineUsers = [];

  const addNewUser = (user_id, socketId) => {
    !onLineUsers.some(user => user.user_id === user_id) &&
      onLineUsers.push({user_id, socketId});
  };

  const removeUser = (socketId) => {
    onLineUsers = onLineUsers.filter(user => user.socketId !== socketId);
  };

  const getUser = (user_id) => {
    return  onLineUsers.find(user => user.user_id === user_id);
  };


  io.on('connection', socket => {

    // -- Escuchando cuando se conecte un cliente ---
    socket.on("newUser", user_id => {
      addNewUser(user_id, socket.id);
      console.log('onLineUsers: ', onLineUsers);
    });

    // --------------------- Mensajes de chat --------------------------
    socket.on("private-message", ({sender_id, receiver_id, scroll}) => {
      console.log("sender_id: ",sender_id, "receiver_id: ", receiver_id)
      const receiver = getUser(receiver_id);
      const sender = getUser(sender_id);
      const data = {msj:"mensaje-entregado", scroll}
      io.to(sender?.socketId).emit("mensaje-recibido", data);
      io.to(receiver?.socketId).emit("mensaje-recibido", data);
    });
    socket.on("disconnect", () => {
      removeUser(socket.id)
    })
  });
}




