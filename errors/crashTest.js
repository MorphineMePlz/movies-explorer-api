const routerCrash = require('express').Router();

routerCrash.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = routerCrash;
