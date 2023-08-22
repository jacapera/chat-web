const { Message } = require('../../db');

const deleteMessage = async (id) => {
  const messageDelected = await Message.destroy({
    where: { id }
  })
  return messageDelected;
};

module.exports = deleteMessage;