const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(v);
      },
      message: 'Введён некорректный URL',
    }
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'OwnerId is required'],
  },
  likes:
    [{
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      default: [],
    }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('card', cardSchema);
