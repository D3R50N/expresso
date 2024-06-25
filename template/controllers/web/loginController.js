const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const config = require("../../config/config");
const errors = require("../../core/errors");
const ROUTES = require("../../routes/routes");
const { e500, e400 } = require("../../middlewares/errorHandler");
const { clearCookie, getCookie, setCookie } = require("../../utils/cookies");
const { generateToken } = require("../../services/authService");

exports.index = async (req, res) => {
  try {
    var expiredCode = getCookie(req, "_exp") || 0;
    if (expiredCode == 1) {
      clearCookie(res, "_exp");

      return res.render("login", {
        error: {
          message: "Your session has expired.",
        },
      });
    }
    return res.render("login");
  } catch (err) {
    console.log(err.message);
    e400(req, res);
  }
};

exports.post = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.render("login", {
        body: req.body,
        error: errors.code.EMAIL_REQUIRED,
      });
    }
    if (!password) {
      return res.render("login", {
        body: req.body,
        error: errors.code.PASSWORD_REQUIRED,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        body: req.body,
        error: errors.code.USER_NOT_EXIST,
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.render("login", {
        body: req.body,
        error: errors.code.PASSWORD_INCORRECT,
      });
    }
    const token = generateToken(user);

    setCookie(res, "_tk", token);

    const redirect = req.query.redirect || ROUTES.WEB.INDEX;
    res.redirect(redirect);
  } catch (err) {
    console.log(err.message);
    e500(req, res);
  }
};
