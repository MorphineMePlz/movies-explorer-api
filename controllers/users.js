const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const {
  STATUS_CREATED,
} = require('../utils/constants');
const { jwtSign, setCookies } = require('../utils/constants');

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const { name, email } = req.body;
    const newUser = await User.create({
      name: escape(name),
      email,
      password: hash,
    });
    const token = jwtSign(newUser, '7d');

    return res
      .status(STATUS_CREATED)
      .cookie('jwt', token, setCookies(3600000 * 24 * 7))
      .json({
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
      });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Введены некорректные данные'));
    }
    if (e.code === 11000) {
      return next(new ConflictError('Данные уже существует'));
    }
    return next(e);
  }
};

// login

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'JWT_SECRET', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 12 * 3600000), httpOnly: true, sameSite: 'None', secure: true,
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
