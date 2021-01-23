require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const users = require('./routes/users.js');
const cards = require('./routes/cards.js');

const auth = require('./middlewares/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const NotFoundError = require('./errors/notFoundError.js');
const NotAuthorizedError = require('./errors/notAuthorizedError');
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT = 3000 } = process.env;
const { errors } = require('celebrate');

// подключаемся к серверу mongon
mongoose.connect('mongodb://localhost:27017/mongodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);


app.use('/', auth, users);
app.use('/', auth, cards);


app.use(errorLogger); // подключаем логгер ошибок


// celebrate errors handler
app.use(errors());

app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
});