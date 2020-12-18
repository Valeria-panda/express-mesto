const Card = require('../models/card');


const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
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
  .then((likes) => res.send({ data: likes }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const dislikeCard = (req, res) => {
 Card.findByIdAndUpdate(req.params._id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
  .then((likes) => res.send({ data: likes }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}



module.exports = { getCards, createCard, likeCard, dislikeCard };
