const { Message, Chat } = require('../../db');
const { Op } = require('sequelize');

const postMessage = async(message) => {
  //console.log("MENSAJE: ",message)
  const { sender_id, receiver_id, content, file } = message
  try {
    // Buscar un chat existente entre el remitente y el receptor
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1_id: sender_id, user2_id: receiver_id },
          { user1_id: receiver_id, user2_id: sender_id },
        ],
      },
    });
    //console.log("chat:", chat)
    // Si no hay un chat existente, creemos uno nuevo
    if (!chat) {
      chat = await Chat.create({
        user1_id: sender_id,
        user2_id: receiver_id,
      });
    }
    // Crear el mensaje
    const message = await Message.create({
      chat_id: chat.chat_id,
      sender_id,
      receiver_id,
      content,
      file,
    });
    chat.updated_at = new Date();
    await chat.save();
    return message;
  } catch (error) {
    throw new Error(error.message)
  }
};

module.exports = postMessage;