const express = require('express');
const app = express();
const path = require('path');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mongodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5fd908b14e2754110bf6c47a'
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', (req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});


app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
});
