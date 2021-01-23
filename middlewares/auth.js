const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/notAuthorizedError');

module.exports = (req, res, next) => {

 const { authorization } = req.headers;

 if(!authorization || !authorization.startsWith('Bearer')){
   throw new NotAuthorizedError({ message: 'С токеном что-то не так' });
 }

 const token = authorization.replace('Bearer ', '');
 let payload;

 try{
   payload = jwt.verify(token, 'secret-key')
 } catch(err) {

  throw new NotAuthorizedError({ message: 'Необходима авторизация' });

 }

 req.user = payload; // записываем пейлоуд в объект запроса

 next(); // пропускаем запрос дальше

}