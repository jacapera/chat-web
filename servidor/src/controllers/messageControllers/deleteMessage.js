const { Message } = require('../../db');
const { unlinkFile } = require('../../helpers/auth');

const deleteMessage = async (message_id) => {
  const messageDelected = await Message.findOne({where: { message_id }})
  if(
    messageDelected.content === "🚫 Este archivo ya no esta disponible." ||
    messageDelected.content === "🚫 Eliminaste este mensaje."
  ){
    await messageDelected.destroy()
    return
  }
  if(messageDelected){
    if(messageDelected.file !== "" || messageDelected.file){
      unlinkFile(messageDelected.file)
      messageDelected.file = null
      messageDelected.content = "🚫 Este archivo ya no esta disponible."
      await messageDelected.save()
    } else {
      messageDelected.content = "🚫 Eliminaste este mensaje."
      await messageDelected.save()
    }
  }
  return messageDelected;
};

module.exports = deleteMessage;