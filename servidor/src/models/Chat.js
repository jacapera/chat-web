const { DataTypes } = require('sequelize');
const User = require('./User');

module.exports = (sequelize) => {
  sequelize.define('Chat', {
    chat_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user1_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: User,
        key: 'user_id',
      },
    },
    user2_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: User,
        key: 'user_id',
      },
    },
    created_at:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, { timestamps: false});
};