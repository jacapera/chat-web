require('dotenv').config();
const { User } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginUser = async (email, password) => {
  if(!email || !password){
    const error = new Error('Falta información');
    error.statusCode = 404;
    throw error;
  }
  const userFound = await User.findOne({
    where:{ email }, attributes:{include:['password']}
  });
  //console.log('login', userFound)
  if(userFound){
    console.log(password, userFound.password);
    const isValidPassword = await bcrypt.compare(password, userFound.password);
    if(isValidPassword && userFound.email === email) {
      userFound.session = true;
      await userFound.save();
      const { password, ...userDataWithoutPassword } = userFound.dataValues;
      const token = jwt.sign(userDataWithoutPassword, JWT_SECRET_KEY, {expiresIn: "24h"});
      const user = {
        ...userDataWithoutPassword,
        token,
        access:true
      }
      return user;
    }
  } else {
    const error = new Error('No te encuentras registrado o hay error en los datos');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = loginUser;
