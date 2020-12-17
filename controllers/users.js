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
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};
  // return User.countDocuments()
  // .then(count => {
  //   return User.create({id: count, ...req.body})
  //   .then(user => res.status(200).send(user))
  //   .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  // })
 // };

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, name, about, avatar )
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, avatar)
  .then(updAvatar => res.send({ data: updAvatar }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports = { getUsers, getProfile, createUser, updateUser, updateAvatar };
