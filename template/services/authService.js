const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");

exports.generateToken = (user) => {
  return jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtMaxDate });
};

