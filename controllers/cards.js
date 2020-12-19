const Card = require('../models/card');


const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: 'Переданные данные не валидны' });
      }else{
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    })
};


const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}


const likeCard = (req, res) => {
 Card.findByIdAndUpdate(req.params._id,
  { $addToSet: { likes: req.user._id }}, // добавить _id в массив, если его там нет
  { new: true })
  .orFail(new Error('NotValid'))
  .then((likes) => res.send({ data: likes }))

  .catch((err) => {
    if (err.message === 'NotValid') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });
}

const dislikeCard = (req, res) => {
 Card.findByIdAndUpdate(req.params._id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
  .orFail(new Error('NotValid'))
  .then((likes) => res.send({ data: likes }))
  .catch((err) => {
    if (err.message === 'NotValid') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });
}



module.exports = { getCards, createCard, likeCard, dislikeCard };
