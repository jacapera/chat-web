require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

// function createAccesToken(user) {
//   const expiration = new Date();
//   expiration.setHours(expiration.getHours() + 5);
//   return jwt.sign(tokenPayload(user, expiration), JWT_SECRET_KEY);
// }

function createAccesToken(user) {
  return jwt.sign(user, JWT_SECRET_KEY, {expiresIn: "2h"});
}

function createRefreshToken(user) {
  const expiration = new Date();
  expiration.setMonth(expiration.getMonth() + 1);
  return jwt.sign(tokenPayload(user, expiration), JWT_SECRET_KEY);
}

// function decodeToken(token) {
//   return jwt.decode(token, JWT_SECRET_KEY);
// }

// function tokenPayload(user, expiration, tokenType = 'token') {
//   return {
//     tokenType,
//     user,
//     iat: new Date().getTime(),
//     exp: expiration.getTime(),
//   }
// }

module.exports = {
  createAccesToken,
  createRefreshToken,
}