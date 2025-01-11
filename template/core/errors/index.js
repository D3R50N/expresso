const CookieService = require("../../services/cookies");
const LangService = require("../../services/lang");

class CoreError {
  constructor(req, res) {
    this.req = req;
    this.res = res;

    let errorsFile = require("./fr");
    const lang =
      req.lang ??
      CookieService.of(req, res).get("lang") ??
      LangService.getLang();

    try {
      errorsFile = require(`./${lang}`);
    } catch (_) {}

    this.code = errorsFile.code;
  }

  static from(req, res) {
    return new CoreError(req, res);
  }

  json(code = this.code.SERVER_ERROR) {
    return this.res.status(code.status).json(code);
  }
}

module.exports = CoreError;