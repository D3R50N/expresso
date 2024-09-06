const config = require("../../config/config");
const ROUTES = require("../../routes/routes");
const jwt = require("jsonwebtoken");
const { getCookie } = require("../../utils/cookies");

module.exports = (req, res, next) => {
  const token = getCookie(req, "_tk");
  if (!token) {
    return next();
  }
  try {
    jwt.verify(token, config.jwtSecret);
    return res.redirect(ROUTES.BASE);
  } catch (err) {
      return next();
  }
};
