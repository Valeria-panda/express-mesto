const express = require('express');
const app = express();
const path = require('path');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const { PORT = 3000 } = process.env;



app.use(express.static(path.join(__dirname, 'public')))
app.use('/', usersRouter);
app.use('/', cardsRouter);



app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
});
