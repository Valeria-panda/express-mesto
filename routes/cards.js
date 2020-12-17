const router = require('express').Router();
const { getCards,createCard,getAllCards, likeCard, dislikeCard } = require('../controllers/cards.js')


router.get('/cards', getCards);
router.post('/cards', createCard);
router.get('/cards', getAllCards);
router.put('/:_id/likes', likeCard);
router.delete('/:_id/likes', dislikeCard);

module.exports = router;