const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    group_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: false,
  });

  return Group;
};