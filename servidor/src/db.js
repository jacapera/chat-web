require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/trends`, {
  logging: false,
  native: false
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);


console.log(sequelize.models)
const { User, Message, Chat, GroupParticipant } = sequelize.models;

// Definición de la relación entre User y Chat
User.hasMany(Chat, { foreignKey: 'user1_id', as: 'ChatsSent', onDelete: 'CASCADE' });
User.hasMany(Chat, { foreignKey: 'user2_id', as: 'ChatsReceived', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'user1_id', as: 'UserSent' });
Chat.belongsTo(User, { foreignKey: 'user2_id', as: 'UserReceived' });

// Definición de la relación entre Chat y Message
Chat.hasMany(Message, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'sender_id', onDelete: 'CASCADE' });

User.belongsToMany(Chat, { through: 'group_participants', foreignKey: 'user_id', otherKey: 'group_id', as: 'GroupChats' });

Chat.belongsToMany(User, { through: 'group_participants', foreignKey: 'group_id', otherKey: 'user_id', as: 'Participants' });






//Chat.belongsToMany(User, { through: 'Usuario_chat', as: 'participantes', foreignKey: 'chat_id' });
//User.belongsToMany(Chat, { through: 'Usuario_chat', as: 'chats', foreignKey: 'user_id' });

// Creando chat privado
// --------------------------------------------------------------------------
// mensajes del emisor
// Chat.hasMany(Message,  {as: "message_sent",foreignKey: 'sender_id' });
// Message.belongsTo(Chat, {as: "sender", foreignKey: 'sender_id' });
// // mensajes del receptor
// Chat.hasMany(Message,  {as: "message-received", foreignKey: 'received_id' });
// Message.belongsTo(Chat, {as: "received-message", foreignKey: 'received_id' });



//User.hasMany(Message, {foreignKey: 'user_id' });
//Message.belongsTo(User, {foreignKey: 'user_id' });

// Relación entre Chat y Usuario (Propiedad de chat privado):
// Chat.belongsTo(User, { as: 'emisor', foreignKey: 'emisorId' });
// Chat.belongsTo(User, { as: 'receptor', foreignKey: 'receptorId' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
