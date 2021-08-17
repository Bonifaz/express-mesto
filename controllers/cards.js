const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Данные не найдены' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некоректные данные или формат данных' });
      }

      return res.status(500).send(err);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Данные не найдены' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      $addToSet: { likes: req.user._id },
    }, { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Данные не найдены' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Данные не найдены' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
};
