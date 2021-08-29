const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const response = err.message || 'Произошла неизвестная ошибка';

  res.status(status).send({ response });

  next();
};

module.exports = errorsHandler;
