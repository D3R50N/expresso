const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const config = require("../../config/config");
const errors = require("../../core/errors");
const ROUTES = require("../../routes/routes");
const { e400 } = require("../../middlewares/errorHandler");
const AuthService = require("../../services/auth");
const MailService = require("../../services/mail");
const CookieService = require("../../services/cookies");
const UploadService = require("../../services/upload");
const AppService = require("../../services");

exports.index = async (req, res) => {
  try {
    return res.render("register");
  } catch (err) {
    console.log(err.message);
    req.error = err;
    e400(req, res);
  }
};

exports.post = async (req, res) => {
  try {

    const user = new User(req.body);


    if (!MailService.isEmail(user.email)) {
      UploadService.deleteUploadedFiles(req.files);
      return res.render("register", {
        error: errors.code.INVALID_EMAIL,
        body: req.body,
      });
    }

    if (req.files[0])
      user.image = UploadService.getRoutePath(req.files[0].filename);


    user.password = user.password?.trim();
    user.name = user.name?.trim();

    if (user.password.length < 6) {
      UploadService.deleteUploadedFiles(req.files);


      return res.render("register", {
        error: errors.code.PASSWORD_LENGTH,
        body: req.body,
      });

    }

    if (user.password != req.body['password-repeat']) {
      UploadService.deleteUploadedFiles(req.files);
      return res.render("register", {
        error: errors.code.PASSWORD_NOT_SAME,
        body: req.body,
      });

    }
    await user.save();

    const token = AuthService.generateToken(user);

    CookieService.from(req, res).set(AppService.config.authToken, token);

    const redirect = req.query.redirect || ROUTES.BASE;
    res.redirect(redirect);
  } catch (err) {

    // console.log(err);
    UploadService.deleteUploadedFiles(req.files);

    if (err.message.includes("is required")) {
      return res.render("register", {
        error: errors.code.FIELD_REQUIRED,
        body: req.body,
      });
    }

    if (err.code === 11000)
      return res.render("register", {
        error: errors.code.USER_EXISTS,
        body: req.body,
      });

    return res.render("register", {
      error: errors.code.USER_NOT_CREATED,
      body: req.body,
    });
  }
};
