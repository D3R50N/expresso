const CookieService = require("../services/cookies");

/**
  * Middleware to get theme from request or cookies and set theme for views
  * @param {object} req - The request object.
  * @param {object} res - The response object.
  * @param {function} next - The next middleware function.
  */
const ThemeMode = (req, res, next) => {
    let theme = req.query.theme;
    if (!theme) theme = CookieService.of(req, res).get("theme");
    if (!theme) theme = "dark";
    CookieService.of(req, res).set("theme", theme);

    res.locals.theme = theme;
    next();
}

module.exports = ThemeMode;