const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Данные не найдены' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некоректные данные или формат данных' });
      }

      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некоректные данные или формат данных' });
      }

      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
      if (user === null) {
        return res.status(404).send({ message: 'Данные не найдены' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Данные не найдены' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некоректные данные или формат данных' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
