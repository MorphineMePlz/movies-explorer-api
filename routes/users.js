const routerUsers = require('express').Router();
const {
  updateUser, getUserInfo,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/validator');

routerUsers.get('/me', getUserInfo);
routerUsers.patch('/me', validateUserInfo, updateUser);

module.exports = routerUsers;
