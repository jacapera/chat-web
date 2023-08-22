const { Message, User } = require('../../db');

const getMessages = async () => {
  const messages = await Message.findAll({
    include:[{
      model:User,
      attributes: ['userName', 'image'],
    }]
  });

  return messages;
};

module.exports = getMessages;