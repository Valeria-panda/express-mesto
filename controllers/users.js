const User = require('../models/user');


const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(404).send({message: 'пользователя не существует'}));
}

const getProfile = (req, res) => {
  const { id } = req.params;
  User.findOne({id})
    .then((users) => {
        if(!users){
            return res.status(404).send({message: 'нет пользователя с таким id'})
        }
        return res.status(200).send(users);
    })

    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createUser = (req, res) => {
  const { name, about } = req.body;
  User.create({ name, about })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: 'Переданные данные не валидны' });
      }else{
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    })
};

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, name, about, avatar )
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, avatar)
  .then(updAvatar => res.send({ data: updAvatar }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });
};
module.exports = { getUsers, getProfile, createUser, updateUser, updateAvatar };
