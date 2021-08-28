const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/users');
const cookieParser = require('cookie-parser');
const errorsHandler = require('./middlewares/errors');
const auth = require("./middlewares/auth");
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден.'))
});

app.use(errorsHandler);
app.listen(PORT, () => {
  console.log('Is starter!');
});
