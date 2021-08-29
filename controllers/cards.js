const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данные не найдены'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      }

      next(new ServerError('Ошибка сервера'));
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данные не найдены'));
      } else {
        if (String(card.owner) === owner) {
          card.remove().then(() =>{
          res.status(200).send(card);
        })
        .catch((err) =>{
          next(new ServerError('500: ошибка на сервере'));
        })
        } else {
          next(new Forbidden('403: Нельзя удалять чужие карточки'));
        }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      $addToSet: { likes: req.user._id },
    }, { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данные не найдены'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данные не найдены'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
};
