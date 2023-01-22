const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const {
  STATUS_CREATED,
} = require('../utils/constants');

const { JWT_SECRET } = process.env;

// registration

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(STATUS_CREATED).json({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные'));
      } if (err.code === 11000) {
        return next(new ConflictError(`Данный ${email} уже существует`));
      }
      return next(err);
    });
};

// login

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000, httpOnly: true, sameSite: true, secure: true,
      }).json({ message: 'Токен jwt передан в cookies' });
    }).catch((err) => {
      next(err);
    });
};

// logout

module.exports.logOut = (req, res, next) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли' })
    .catch(next);
};

// getUserInformation

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным ID не найден');
      }
      res.status(STATUS_CREATED).send(user);
    })
    .catch(next);
};

// UpdateUserUnformation

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  ).orFail(() => new NotFoundError('Ничего не найдено'))
    .then((user) => {
      res.send({
        name, email, _id: user._id,
      });
    })
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};
