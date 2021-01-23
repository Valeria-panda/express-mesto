const User = require('../models/user');
const bcrypt = require('bcryptjs'); // импортируем bcrypt.
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const AlreadyExistError = require('../errors/alreadyExistError');
const NotAuthorizedError = require('../errors/notAuthorizedError');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);
}

module.exports.getProfile = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
  .then((user) => {
    if (!user) {
      // если такого пользователя нет
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send(user);
  })
  .catch(next); // добавили catch
}

module.exports.createUser = (req, res, next) => {

  const { name, about, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then( hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))

    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new AlreadyExistError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
    })

    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar, email: user.email,
      },
    }))

    .catch(next);

};

module.exports.login = (req, res, next) => {

  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    // create token
    const token = jwt.sign(
      { _id: user._id},
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d'},
    );
    // return token
    res.send({token});
  })
  .catch(next);
}

module.exports.updateUser = (req, res, next) => {
  const { name, about} = req.body;

  User.findByIdAndUpdate( req.user._id, name, about )
  .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
  .catch((err) => {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new BadRequestError({ message: `Указаны некорректные данные при обновлении пользователя: ${err.message}` });
  })
  .then((user) => res.send({ data: user }))
  .catch(next);
};

module.exports.updateAvatar = (req, res) => {

  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, avatar)

    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new BadRequestError({ message: `Указаны некорректные данные при обновлении аватара: ${err.message}` });
    })
    .then((updAvatar) => res.send({ data: updAvatar }))
    .catch(next);
};





