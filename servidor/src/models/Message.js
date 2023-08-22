const { DataTypes } = require('sequelize');
const Chat = require('./Chat');
const User = require('./User');

module.exports = (sequelize) => {
  sequelize.define('Message', {
    message_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chat_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: Chat,
        key: 'chat_id',
      },
    },
    sender_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: User,
        key: 'user_id',
      },
    },
    receiver_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: User,
        key: 'user_id',
      },
    },
    content:{
      type: DataTypes.TEXT,
      allowNull:false
    },
    messageStatus:{
      type: DataTypes.STRING,
      defaultValue: "sent",
    },
    createdAt:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {timestamps: false});
};