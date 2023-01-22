const router = require('express').Router();
const {
  updateUser, getUserInfo,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/validator');

router.get('/me', getUserInfo);
router.patch('/me', validateUserInfo, updateUser);

module.exports = router;
