const routerAuth = require('express').Router();
const {
  createUser, login, logOut,

} = require('../controllers/users');
const { validateLogin } = require('../middlewares/validator');

routerAuth.post('/signup', validateLogin, createUser);
routerAuth.post('/signin', validateLogin, login);
routerAuth.post('/logout', logOut);

module.exports = routerAuth;
