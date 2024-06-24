const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const errors = require("../../core/errors");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return errors.json(res, errors.code.AUTH_TOKEN_MISSSING);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return errors.json(res, errors.code.AUTH_TOKEN_INVALID);
  }
};
