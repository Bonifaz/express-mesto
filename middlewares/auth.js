const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest');
const Unauthorized =require('../errors/Unauthorized');

const { JWT_SECRET = 'mentos-key' } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new Unauthorized('Неправильный email или пароль'))
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized('Неправильный email или пароль'))
  }

  req.user = payload;

  return next();
};