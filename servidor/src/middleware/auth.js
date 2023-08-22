const { decodeToken } = require("../helpers/jwt");
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY} = process.env;

// function userAuthenticated(req, res, next) {
//   const { authorization } = req.headers;
//   if(!authorization) return res.status(500).send({response: 'El token es requerido'});
//   const token = authorization.replace('Bearer ', '');
//   const userData = decodeToken(token);
//   try {
//     const { exp } = userData;
//     const currentTime = new Date().getTime();
//     if(exp < currentTime) return res.status(400).send({response: 'El token ha expirado'});
//     next();
//   } catch (error) {
//     return res.status(400).send({response: "El token es inválido"});
//   }
//}
function userAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if(!authorization) return res.status(500).send({response: 'El token es requerido'});
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    //console.log(payload);
    jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
      if(error){
        error.name === "TokenExpiredError"
          ? res.status(400).send({response: "El token ha expirado"})
          : res.status(400).send({response: "El token es inválido"});
      }else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({message:error.message});
  }
}

module.exports = {
  userAuthenticated,
}

