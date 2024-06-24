function getCookie(req, cookie) {
  const value = req.cookies[cookie];
  return value;
}
function clearCookie(res, cookie) {
  return res.clearCookie(cookie);
}
function setCookie(res, cookie, value) {
  return res.cookie(cookie, value, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

module.exports = {
  getCookie,
  clearCookie,
  setCookie,
};
