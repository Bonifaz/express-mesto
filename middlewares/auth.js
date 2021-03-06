const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'mentos-key' } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new Unauthorized('Необходима авторизация'));
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
