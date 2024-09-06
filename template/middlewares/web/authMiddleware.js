const config = require("../../config/config");
const ROUTES = require("../../routes/routes");
const jwt = require("jsonwebtoken");
const { getCookie, setCookie, clearCookie } = require("../../utils/cookies");
const User = require("../../models/userModel");
const { code } = require("../../core/errors");

module.exports = async (req, res, next) => {
  const token = getCookie(req, "_tk");
  if (!token) {
    return res.redirect(ROUTES.LOGIN);
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.headers.authorization = token;
    req.user = decoded;
    const user = await User.findById(req.user.userId);
    if (!user) throw new Error(code.USER_NOT_FOUND);
    next();
  } catch (err) {
    return res.redirect(ROUTES.LOGOUT_EXPIRED);
  }
};
