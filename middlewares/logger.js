const winston = require('winston');
const expressWinston = require('express-winston');
// добавить в гитигнор
// *.log

// создадим логгер запросов
const requestLogger = expressWinston.logger({
    transports: [
      new winston.transports.File({ filename: 'request.log' }),
    ],
    format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.File({ filename: 'error.log' }),
    ],
    format: winston.format.json(),
});


module.exports = {
    requestLogger,
    errorLogger,
};