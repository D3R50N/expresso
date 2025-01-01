const config = require("../config/config");

class AppService {
    static config = config;

    static init(config) {
        this.config = config;
    }

}

module.exports = AppService;