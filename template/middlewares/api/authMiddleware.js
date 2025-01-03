const jwt = require("jsonwebtoken");
const AppService = require("../../services");
const CoreError = require("../../core/errors");

module.exports = (req, res, next) => {
  const errors = CoreError.from(req, res);

  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return errors.json(errors.code.AUTH_TOKEN_MISSSING);
  }

  try {
    const decoded = jwt.verify(token, AppService.config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return errors.json(errors.code.AUTH_TOKEN_INVALID);
  }
};
