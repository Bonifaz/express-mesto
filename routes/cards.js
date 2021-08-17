const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards/', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:_id', deleteCard);
cardRouter.put('/cards/:_id/likes', likeCard);
cardRouter.delete('/cards/:_id/likes', deleteLikeCard);

module.exports = cardRouter;
