const { postMessage, getChatsByUser } = require('./controllers');

module.exports = serverSocket => {
  const { Server } = require('socket.io');
  const io = new Server(serverSocket, {cors:{origin:'*'}});

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
    console.log("aqui: ", userNameReceptor)
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
      sender_id, receiver_id, content, file, userNameReceptor, userNameEmisor, createAt,
    }) => {

      console.log("sender_id: ",sender_id)
      const receiver = getUser(userNameReceptor);
      const sender = getUser(userNameEmisor);

      if(file && file.data instanceof Buffer){
        const response = {
          content,
          createAt,
          sender_id,
          file:{
            name: file.name,
            size: file.size,
            type: file.type,
            lastModifiedDate: file.lastModifiedDate,
            lastModified: file.lastModified,
            data: file.data,
          }
        }
        console.log("response: ", response)
        io.to(receiver?.socketId).emit("mensaje-recibido", response);
        io.to(sender?.socketId).emit("mensaje-recibido", response);
      } else {
        postMessage(sender_id, receiver_id, content)
        getChatsByUser(receiver_id)
          .then(response => {
            io.to(receiver?.socketId).emit("mensaje-recibido", response);
            io.to(sender?.socketId).emit("mensaje-recibido", response);
            console.log("mensaje enviado")
          }).catch(error => console.log(error));
      }
      let listChats = []

      console.log("MESSAGES: ", listChats, listChats.length);
      console.log('receiver: ', receiver, content);
      console.log('sender: ', sender, content);

      //if(file && file.data instanceof Buffer) {
              //io.to(receiver?.socketId).emit("mensaje-recibido", messagesServer
        //socket.emit("mensaje-recibido", messagesServer
        // {
        //   emisor, receptor, message, fecha, userNameEmisor,
        //   userNameReceptor, imageEmisor, imageReceptor,
        //   file:{
        //     name: file.name,
        //     size: file.size,
        //     type: file.type,
        //     lastModifiedDate: file.lastModifiedDate,
        //     lastModified: file.lastModified,
        //     data: file.data
        //   },
        // }
       // );
     // } else {
        //io.to(receiver?.socketId).emit("mensaje-recibido", listChats
        //socket.emit("mensaje-recibido", filtered
        // {
        //   emisor, receptor, messageChat, fecha, userNameEmisor, userNameReceptor, imageEmisor, imageReceptor
        // }
       // );
     // }
      //console.log('mensaje recibido: ', `emisor: ${userNameEmisor}`, `receptor: ${userNameReceptor}`, messageChat);
    });

    socket.on("disconnect", () => {
      //filtered =[]
      removeUser(socket.id)
    })

  });
}





//const privateRooms = {}

// Chat Individual v1
    // --------------------------------------------------------------------- -------
    // socket.on("private-message", ({
    //   emisor,
    //   receptor,
    //   message,
    //   userName,
    //   image,
    //   fecha,
    //   file
    // }) => {
    //   console.log('emisor-receptor: ',emisor, receptor)

    //   const roomId = `${emisor}_${receptor}`;
    //   const reverseRoomId = `${receptor}_${emisor}`;
    //   console.log('sala: ',roomId, reverseRoomId)


    //   if(privateRooms[roomId] || privateRooms[reverseRoomId]){
    //     const existingRoomId = privateRooms[roomId] ? roomId : reverseRoomId;
    //     console.log('existingRoomId', existingRoomId)
    //     socket.join(existingRoomId)
    //     socket.emit("chat-iniciado", existingRoomId);
    //     if(file && file.data instanceof Buffer) {
    //       io.to(existingRoomId).emit("mensaje-recibido", {
    //         emisor,
    //         receptor,
    //         message,
    //         fecha,
    //         from: userName,
    //         image,
    //         file:{
    //           name: file.name,
    //           size: file.size,
    //           type: file.type,
    //           lastModifiedDate: file.lastModifiedDate,
    //           lastModified: file.lastModified,
    //           data: file.data
    //         },
    //       });
    //     } else {
    //       io.to(existingRoomId).emit("mensaje-recibido", {
    //         emisor,
    //         receptor,
    //         message,
    //         fecha,
    //         from: userName,
    //         image,
    //         msg:"remoto enviado"
    //       });
    //     }
    //   } else {
    //     socket.room = roomId;
    //     socket.join(roomId);
    //     console.log('join:' ,roomId)
    //     privateRooms[roomId] = { [emisor]: true, [receptor]:true};
    //     console.log('RoomId: ', roomId)
    //     socket.emit("chat-iniciado", roomId);

    //     if(file && file.data instanceof Buffer){
    //       io.to(roomId).emit("mensaje-recibido", {
    //         emisor,
    //         receptor,
    //         message,
    //         fecha,
    //         from: userName,
    //         image,
    //         file:{
    //           name: file.name,
    //           size: file.size,
    //           type: file.type,
    //           lastModifiedDate: file.lastModifiedDate,
    //           lastModified: file.lastModified,
    //           data: file.data
    //         },
    //       });
    //     } else {
    //       io.to(roomId).emit("mensaje-recibido", {
    //         emisor,
    //         receptor,
    //         message,
    //         fecha,
    //         from: userName,
    //         image,
    //         msg:"remoto enviado"
    //       });
    //     }
    //   }
      //socket.leave(roomId);

    //   console.log('mensaje recibido: ', emisor, receptor, message);
    //   console.log('privateRoom', privateRooms);
    // });
    // socket.on("conectar-sala", roomId => {
    //   console.log('join:' ,roomId)
    //   socket.join(roomId);
    // })
    
    // Escuchando evento del cliente y enviando a todos CHAT GRUPAL
    // ----------------------------------------------------------------------------
    // socket.on("message", ({ emisor, receptor, message, userName, image, fecha, file }) => {
    //   //console.log("archivo recibido: ", file);
      
    //   if(file && file.data instanceof Buffer){
    //     console.log("Evento recibido: ", emisor, receptor, message, userName, fecha, file);
    //     socket.broadcast.emit("message", {
    //       emisor,
    //       receptor,
    //       message,
    //       fecha,
    //       from: userName,
    //       image,
    //       file:{
    //         name: file.name,
    //         size: file.size,
    //         type: file.type,
    //         lastModifiedDate: file.lastModifiedDate,
    //         lastModified: file.lastModified,
    //         data: file.data
    //       },
    //     });
    //   } else {
    //     //postMessage(user_id, message)
    //     console.log("Evento recibido: ", emisor, receptor, message, userName, fecha);

    //     socket.broadcast.emit("message", {
    //       emisor,
    //       receptor,
    //       message,
    //       fecha,
    //       from: userName,
    //       image,
    //     });
    //   }

      
    // });