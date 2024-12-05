const AppService = require("..");

class CookieService {

    static #config = AppService.config;

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

   static from(req, res) {
        return new CookieService(req, res);
    }

    get(name) {
        return this.req.cookies[name];
    }
    set(name, value) {
        const maxAge = this.#cookieAge(CookieService.#config.cookieMaxDate);
        this.res.cookie(name, value, { maxAge });
    }
    clear(name) {
        return this.res.clearCookie(name);
    }



    #cookieAge(str) {
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
  

}

module.exports = CookieService;