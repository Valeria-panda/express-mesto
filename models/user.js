const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const NotAuthorizedError = require('../errors/notAuthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    minlength: 2,
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(v);
      },
      message: 'invalid URL',
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'некорректный email',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  }

});

userSchema.statics.findUserByCredentials = function(email, password){

  // пытаемся найти пользовател по почте
  return this.findOne({email}) // this — это модель User
    .then((user)=>{
      // не нашёлся — отклоняем промис
      if(!user){
        throw new NotAuthorizedError({ message: 'Неправильные email или пароль' });
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
      .then((matched) => {
        if(!matched){
          throw new NotAuthorizedError({ message: 'Неправильные email или пароль' });
        }
        return user;
      });
    });
}





module.exports = mongoose.model('user', userSchema);
