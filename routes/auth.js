const routerAuth = require('express').Router();
const {
  createUser, login, logOut,

} = require('../controllers/users');
const { validateLogin } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

routerAuth.post('/signup', validateLogin, createUser);
routerAuth.post('/signin', validateLogin, login);
routerAuth.post('/logout', auth, logOut);

module.exports = routerAuth;
