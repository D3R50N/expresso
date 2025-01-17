const config = require("../config");


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
   * @param {string} config.appLang - The default language for the application.
   * @param {string} config.mailerUser - The email address used for sending emails.
   * @param {string} config.mailerPwd - The password for the email address.
   * @param {string} config.mailerAppName - The name of the email application.
   * @param {string} config.stripeSecretKey - The secret key for the Stripe API.
   */
  static init(config) {
    this.config = config;
  }
}

module.exports = AppService;
