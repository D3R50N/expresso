const User = require("../models/userModel");

exports.findUserByEmail = async (email) => {
  return User.findOne({ email });
};

