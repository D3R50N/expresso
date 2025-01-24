const ROUTES = require("../../routes/routes");
const { e400 } = require("../../middlewares/errorHandler");
const CookieService = require("../../services/cookies");
const AppService = require("../../services");

class LogoutController {
  static async index(req, res) {
    try {
      const expNumber = req.query._exp || 0;
      CookieService.of(req, res).clear(AppService.config.authToken);
      CookieService.of(req, res).set("_exp", expNumber);
      return res.redirect(ROUTES.LOGIN);
    } catch (err) {
      console.log(err);
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }
}

module.exports = LogoutController;
