const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.createCard = (req, res, next) => {
  // const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })

  .then((card) => res.status(201).send({ data: card }))

  .catch((err) => {
    throw new BadRequestError({ message: `Указаны некорректные данные при создании карточки: ${err.message}` });
  })
  .catch(next);
};

module.exports.getCards = (req, res) => {
  Card.find({})

  .then((cards) => res.send({ data: cards }))

  .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
}

module.exports.likeCard = (req, res, next) => {

 Card.findByIdAndUpdate(req.params._id,
  { $addToSet: { likes: req.user._id }}, // добавить _id в массив, если его там нет
  { new: true })

  .orFail()
  .then((likes) => res.send({ data: likes }))

  .catch(() => {
    throw new NotFoundError({ message: 'Не существует карточки с таким id' });
  })

  .catch(next);
}

module.exports.dislikeCard = (req, res, next) => {

 Card.findByIdAndUpdate(req.params._id,

  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
    .orFail()

    .then((likes) => res.send({ data: likes }))
    .catch(() => {
      throw new NotFoundError({ message: 'Не существует карточки с таким id' });
    })

    .catch(next);
}

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет карточки с таким id' });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Не достаточно прав' });
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};




