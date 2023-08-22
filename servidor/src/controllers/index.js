const postUser = require('./userControllers/postUser');
const getUsers = require('./userControllers/getUsers');
const loginUser = require('./userControllers/loginUser');
const getUserById = require('./userControllers/getUserById');
const updateUser = require('./userControllers/updateUser');

const getMessages = require('./messageControllers/getMessages');
const postMessage = require('./messageControllers/postMessage');
const deleteMessage = require('./messageControllers/deleteMessage');


const getChatsByUser = require('./chatControllers/getChatsByUser');
const getChats = require('./chatControllers/getChats');
const getChatOne = require('./chatControllers/getChatOne');



module.exports = {
// --- Users ------
  postUser,
  getUsers,
  loginUser,
  getUserById,
  updateUser,

// --- Messages ----
  getMessages,
  postMessage,
  deleteMessage,

// ---- Chats ------
  getChatsByUser,
  getChats,
  getChatOne,
}