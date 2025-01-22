const User = require("../../models/userModel");
const ROUTES = require("../../routes/routes");
const { e500, e400 } = require("../../middlewares/errorHandler");
const CookieService = require("../../services/cookies");
const AuthService = require("../../services/auth");
const AppService = require("../../services");
const Errors = require("../../../config/errors");

exports.index = async (req, res) => {
  try {
    var expiredCode = CookieService.of(req, res).get("_exp") || 0;
    if (expiredCode == 1) {
      CookieService.of(req, res).clear("_exp");

      return res.render("login", {
        error: Errors.from(req,res).code.SESSION_EXPIRED,
      });
    }
    return res.render("login");
  } catch (err) {
    console.log(err.message);
    req.error = err;
    e400(req, res);
  }
};

exports.post = async (req, res) => {
  const errors = Errors.from(req, res);
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
    const token = AuthService.generateToken(user);

    CookieService.of(req, res).set(AppService.config.authToken, token);

    const redirect = req.query.redirect || ROUTES.BASE;
    res.redirect(redirect);
  } catch (err) {
    console.log(err.message);
    req.error = err;
    e500(req, res);
  }
};
