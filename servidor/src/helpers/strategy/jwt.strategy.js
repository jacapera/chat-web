const { Strategy, ExtractJwt } = require('passport-jwt');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:JWT_SECRET_KEY
}

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;