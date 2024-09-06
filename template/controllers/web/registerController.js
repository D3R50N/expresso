const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const config = require("../../config/config");
const errors = require("../../core/errors");
const ROUTES = require("../../routes/routes");
const { e400 } = require("../../middlewares/errorHandler");
const { setCookie } = require("../../utils/cookies");
const { generateToken } = require("../../services/authService");

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
    
    // Store base64 image in image field
    if (req.body.image_base64) {
      req.body.image = req.body.image_base64;
      delete req.body.image_base64;
    }

    const user = new User(req.body);


    if (!isEmail(user.email))
      return res.render("register", {
        error: errors.code.INVALID_EMAIL,
        body: req.body,
      });

    user.password = user.password?.trim();
    user.name = user.name?.trim();

    if (user.password.length < 6)
      return res.render("register", {
        error: errors.code.PASSWORD_LENGTH,
        body: req.body,
      });
    
    await user.save();

    const token = generateToken(user);

    setCookie(res, "_tk", token);

    const redirect = req.query.redirect || ROUTES.BASE;
    res.redirect(redirect);
  } catch (err) {
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
