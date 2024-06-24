const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const config = require("../../config/config");
const errors = require("../../core/errors");
const { generateToken } = require("../../services/authService");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return errors.json(res, errors.code.EMAIL_REQUIRED);
    }

    if (!password) {
      return errors.json(res, errors.code.PASSWORD_REQUIRED);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errors.json(res, errors.code.USER_NOT_EXIST);
    }

    if (!(await user.comparePassword(password))) {
      return errors.json(res, errors.code.PASSWORD_INCORRECT);
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, code: errors.code.SERVER_ERROR.code });
  }
};

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) errors.json(res, errors.code.USER_EXISTS);
    else errors.json(res, errors.code.USER_NOT_CREATED);
  }
};
