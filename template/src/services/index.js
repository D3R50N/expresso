const config = require("../../config");

/**
 * Service for the currrent app.
 * Needs a configuration file
 */
class AppService {
  /**
   * The configuration object for the application.
   *
   * @type {Object}
   */
  static config = config;

  /**
   * Initializes the AppService with the provided configuration.
   *
   * @param {Object} config - The configuration object to set for the application.
   */
  static init(config) {
    this.config = config;
  }
  
}

module.exports = AppService;
