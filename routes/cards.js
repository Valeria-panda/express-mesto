const router = require('express').Router();
const { getCards,createCard, likeCard, dislikeCard } = require('../controllers/cards.js')


router.get('/cards', getCards);
router.post('/cards', createCard);
router.put('/cards/:_id/likes', likeCard);
router.delete('/cards/:_id/likes', dislikeCard);

module.exports = router;
