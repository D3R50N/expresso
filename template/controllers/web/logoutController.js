const ROUTES = require("../../routes/routes");
const { e400 } = require("../../middlewares/errorHandler");
const CookieService = require("../../services/cookies");
const AppService = require("../../services");

exports.index = async (req, res) => {
  try {
    const expNumber = req.query._exp || 0;
    CookieService.from(req, res).clear(AppService.config.authToken);
    CookieService.from(req, res).set("_exp", expNumber);
    return res.redirect(ROUTES.LOGIN);
  } catch (err) {
    console.log(err);
    console.log(err.message);
    req.error = err;
    e400(req, res);
  }
};
