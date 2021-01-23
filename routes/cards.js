const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, deleteCard, createCard, likeCard, dislikeCard } = require('../controllers/cards.js')


router.get('/cards', getCards);

router.post('/cards', celebrate({
    body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    }),
}), createCard);// создание карточки

router.put('/cards/:_id/likes', celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
}), likeCard); // лайк карточки

router.delete('/cards/:_id/likes', celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
}), dislikeCard);// дизлайк карточки

router.delete('/cards/:_id',celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
}), deleteCard);// удаление карточки





module.exports = router;