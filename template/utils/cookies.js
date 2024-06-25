const config = require("../config/config");

function getCookie(req, cookie) {
  const value = req.cookies[cookie];
  return value;
}
function clearCookie(res, cookie) {
  return res.clearCookie(cookie);
}

function cookieAgeToNumber(str) {
  const numRegex = /\d+/;
  const num = str.match(numRegex);
  const suffix = str.replace(numRegex, "");

  switch (suffix) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return num;
  }
}
function setCookie(res, cookie, value) {
  return res.cookie(cookie, value, {
    maxAge: cookieAgeToNumber(config.cookieMaxDate),
  });
}

module.exports = {
  getCookie,
  clearCookie,
  setCookie,
};
