const jwt = require('jsonwebtoken');

const STATUS_CREATED = 201;
const DELETE_ITEM = 'Deleted';
const jwtSign = (user, expiresIn) => jwt.sign({ _id: user._id }, 'JWT_SECRET', { expiresIn });
const setCookies = (maxAge) => ({
  maxAge,
  httpOnly: true,
  sameSite: true,
  secure: true,
});

module.exports = {
  STATUS_CREATED,
  DELETE_ITEM,
  jwtSign,
  setCookies,
};
