
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/notAuthorizedError');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new NotAuthorizedError({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};