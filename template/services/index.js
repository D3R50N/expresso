const config = require("../config/config");

class AppService {
    static config = config;

    static init(config) {
        this.config = config;
    }

    static getUrl = (req, full = false) => req.protocol + '://' + req.get('host') + (full ? req.originalUrl : "");

}

module.exports = AppService;