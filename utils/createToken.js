const jwt = require('jsonwebtoken');
require("dotenv").config();

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

module.exports = createToken;
