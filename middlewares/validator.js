const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateMovieCreation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(200),
    director: Joi.string().required().min(2).max(200),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(5),
    description: Joi.string().required().min(2).max(5000),
    image: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Ошибка валидации. Введён не URL');
        }
        return value;
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Ошибка валидации. Введён не URL');
        }
        return value;
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Ошибка валидации. Введён не URL');
        }
        return value;
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(1).max(200),
    nameEN: Joi.string().required().min(1).max(200),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
