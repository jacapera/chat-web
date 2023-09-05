const { Chat, User, Message } = require('../../db');
const { Op } = require('sequelize');

const getChatsByUser = async (user_id) => {
  const chats = await Chat.findAll({
    where:{
      [Op.or]: [
        { user1_id: user_id },
        { user2_id: user_id },
      ],
    },
    include: [
      {
        model: User,
        as: "UserSent", // Nombre de la relación entre Chat y User (remitente del chat)
      },
      {
        model: User,
        as: "UserReceived", // Nombre de la relación entre Chat y User (receptor del chat)
      },
      {
        model: Message,
      },
    ],
  });

  // ordenar los mensajes de cada chat por fecha de creación
  chats.forEach((chat) =>{
    return chat.Messages.sort((a, b) => a.createdAt - b.createdAt)
  })

  return chats;
};


module.exports = getChatsByUser;