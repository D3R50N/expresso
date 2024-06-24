const config = require("../../config/config");
const ROUTES = require("../../routes/routes");
const jwt = require("jsonwebtoken");
const { getCookie, setCookie, clearCookie } = require("../../utils/cookies");

module.exports = (req, res, next) => {
  const token = getCookie(req, "_tk");
  if (!token) {
    return res.redirect(ROUTES.WEB.LOGIN);
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.headers.authorization = token;
    req.user = decoded;
    next();
  } catch (err) {
    clearCookie(res, '_tk');
    setCookie(res,"_exp",true)
    return res.redirect(ROUTES.WEB.LOGIN);
  }
};
