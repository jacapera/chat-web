const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('User', {
    user_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
    },
    rol:{
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false,
    defaultScope:{
      attributes:{exclude: ['password']}
    }
  });
};