const { DataTypes } = require('sequelize');
const  Group = require('./Group');
const User = require('./User');

module.exports = (sequelize) => {
  const GroupParticipant = sequelize.define('GroupParticipant', {
    group_participant_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      reference:{
        model: Group,
        key: 'group_id',
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: User,
        key: 'user_id',
      },
    },
    createdAt:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: false,
  });

  return GroupParticipant;
};