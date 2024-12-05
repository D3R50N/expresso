const { e400 } = require("../../middlewares/errorHandler");

exports.index = async (req, res) => {
  try {
    const user = await AuthService.authUser(req);
    const name = req.query.name || user.email;
    return res.render("index", { name: name, user });
  } catch (err) {
    console.log(err.message);
    req.error = err;
    e400(req, res);
  }
};
