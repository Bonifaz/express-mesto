const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const ServerError = require('../errors/ServerError');
const Conflict = require('../errors/Conflict');

const getUsers = (req, res, next) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
    .catch(() => {
      next(new ServerError('Ошибка сервера'));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Данные не найдены'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      }

      next(new ServerError('Ошибка сервера'));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new Conflict('Пользователь с таким email существует'));
    }
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name, about, avatar, email, password: hash,
        })
          .then(() => {
            res.status(200).send({
              data: {
                name, about, avatar, email,
              },
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('Некоректные данные или формат данных'));
            }
            next(new ServerError('Ошибка сервера'));
          });
      })
      .catch(() => {
        next(new ServerError('Ошибка сервера'));
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Данные не найдены'));
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Данные не найдены'));
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильный логин или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            next(new Unauthorized('Неправильный логин или пароль.'));
          }
          return user;
        });
    })

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mentos-key', { expiresIn: '7d' });
      return res
        .status(201)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Авторизация успешно пройдена', token });
    })

    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new Unauthorized('Неправильный логин или пароль.'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Unauthorized('Неправильный логин или пароль.'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMyInfo,
};
