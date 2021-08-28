const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest');

const { JWT_SECRET = 'mentos-key' } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new BadRequest('Некоректные данные или формат данных'))
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new BadRequest('Некоректные данные или формат данных'))
  }

  req.user = payload;

  return next();
};