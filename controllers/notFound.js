const NotFoundError = require('../errors/NotFoundError');

module.exports.notFoundError = (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден'));
