const Errors = require("../../../config/errors");
const User = require("../../models/userModel");
const AuthService = require("../../services/auth");
const UploadService = require("../../services/upload");

exports.login = async (req, res) => {
  const errors = Errors.from(req, res);
  try {
    const { email, password } = req.body;

    if (!email) {
      return errors.json(errors.code.EMAIL_REQUIRED);
    }

    if (!password) {
      return errors.json(errors.code.PASSWORD_REQUIRED);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errors.json(errors.code.USER_NOT_EXIST);
    }

    if (!(await user.comparePassword(password))) {
      return errors.json(errors.code.PASSWORD_INCORRECT);
    }
    const token = AuthService.generateToken(user);
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, code: errors.code.SERVER_ERROR.code });
  }
};

exports.register = async (req, res) => {
  const errors = Errors.from(req, res);

  try {
    const user = new User(req.body);

    user.password = user.password?.trim();
    user.name = user.name?.trim();

    if (!user.password) {
      return errors.json(errors.code.PASSWORD_REQUIRED);
    }

    if (user.password.length < 6) {
      return errors.json(errors.code.PASSWORD_LENGTH);
    }

    if (user.password != req.body["password-repeat"]) {
      return errors.json(errors.code.PASSWORD_NOT_SAME);
    }
    await user.save();

    const token = AuthService.generateToken(user);

    res.status(201).json({ token });
  } catch (err) {
    const errors = Errors.from(req, res);
    if (err.code === 11000) errors.json(errors.code.USER_EXISTS);
    else errors.json(errors.code.USER_NOT_CREATED);
  }
};

exports.user = async (req, res) => {
  const errors = Errors.from(req, res);
  try {
    const user = await AuthService.authUser(req, { isBearer: true });
    user.password = "***";
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, code: errors.code.SERVER_ERROR.code });
  }
};
