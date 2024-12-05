const { e400 } = require("../../middlewares/errorHandler");
const AuthService = require("../../services/auth");

exports.index = async (req, res) => {
  try {
    const user = await AuthService.authUser(req);
    return res.render("index", { user });
  } catch (err) {
    console.log(err.message);
    req.error = err;
    e400(req, res);
  }
};
