const AppService = require("..");

/**
 * Service for managing stripe payment and subscriptions
 */
class PaymentService {
  static #config = AppService.config;

  static stripe = this.#config.stripeSecretKey
    ? require("stripe")(this.#config.stripeSecretKey)
    : null;

  /**
   * Creates a Stripe customer for the given user.
   *
   * @param {Object} user - The user object for which to create a Stripe customer.
   * @param {string} user.email - The email of the user.
   * @param {string} user.name - The name of the user.
   *
   * @returns {Promise<Object>} - The created Stripe customer object.
   */
  static async createStripeCustomer(user) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    user.stripeId = customer.id;

    await user.save();

    return customer;
  }
}

module.exports = PaymentService;
