const AppService = require("..");
const CookieService = require("../cookies");
const translations = require("./translations");

class LangService {
  static #config = AppService.config;
  static #lang = this.#config.appLang;

  static setLang = (str = this.#lang) => (this.#lang = str);
  static getLang = () => this.#lang;

  static setVars(res, vars = {}) {
    for (let key of Object.keys(res.locals.tr ?? {})) {
      for (let v of Object.keys(vars)) {
        const tr = res.locals.tr[key];
        res.locals.tr[key] = tr
          .replaceAll("\\$", "$$")
          .replaceAll("$" + v, vars[v])
          .replaceAll("$$", "$");
      }
    }
  }

  static tr(req, res, next) {
    res.locals.tr = {};

    let lang = req.query.lang;
    if (!translations[lang]) lang = CookieService.of(req, res).get("lang");
    if (!translations[lang]) lang = this.getLang();

    const translation = translations[lang];
    if (!translation) return next();

    CookieService.of(req, res).set("lang", lang);
    req.lang = lang;
    res.locals.lang = lang;
    res.locals.langs = Object.keys(translations);
    for (let key of Object.keys(translation)) {
      const tr = translations[lang][key];
      res.locals.tr[key.toUpperCase()] = tr;
      res.locals.tr[key.toLowerCase()] = tr;
    }
    next();
  }
}

module.exports = LangService;
