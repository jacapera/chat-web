const { Chat, User, Message } = require('../../db');

const getChats = async () => {
  const chats = await Chat.findAll({
    include: [
      {model: User, as: 'participantes', through: {attributes:[]}},
      {model: Message, as: 'mensajes'}
    ]
  });
  return chats;
};


module.exports = getChats;