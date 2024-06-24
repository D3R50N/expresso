const { e400 } = require("../../middlewares/errorHandler");
const User = require("../../models/userModel");

exports.index = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const name = req.query.name || user.email;
    return res.render("index", { name: name });
  } catch (err) {
    console.log(err.message);
    e400(req, res);
  }
};
