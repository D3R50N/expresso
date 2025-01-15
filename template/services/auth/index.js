const jwt = require("jsonwebtoken");
const AppService = require("..");
const User = require("../../models/userModel");
const CookieService = require("../cookies");
const PaymentService = require("../payment");
const { strDate, dateFromStamp } = require("../date");
/**
 * Service for handling authentication and user-related operations.
 * Includes functionality for generating tokens, authenticating users,
 * and integrating with Stripe for subscription management.
 */
class AuthService {
  /**
   * Configuration settings for the authentication service.
   * @type {object}
   * @private
   */
  static #config = AppService.config;

  /**
   * Generates a JSON Web Token (JWT) for a user.
   * @param {object} user - The user object containing at least an `id` property.
   * @returns {string} The generated JWT.
   */
  static generateToken = (user) => {
    return jwt.sign({ userId: user.id }, this.#config.jwtSecret, {
      expiresIn: this.#config.jwtMaxDate,
    });
  };

  /**
   * Authenticates a user based on a token stored in cookies.
   * Optionally integrates with Stripe to fetch subscription details.
   *
   * @param {object} req - The HTTP request object, containing cookies and headers.
   * @param {boolean} [withStripe=false] - Whether to fetch Stripe subscription details for the user.
   * @returns {Promise<object|null>} The authenticated user object, including Stripe data if requested, or `null` if authentication fails.
   */
  static async authUser(req, withStripe = false) {
    const token = CookieService.of(req, null).get(this.#config.authToken);

    if (!token) {
      return null;
    }
    try {
      const decoded = await jwt.verify(token, this.#config.jwtSecret);
      req.headers.authorization = token;
      req.user = decoded;
      const user = await User.findById(req.user.userId);
      if (!user) return null;

      if (!withStripe) return user;

      const stripeId =
        user.stripeId ?? (await PaymentService.createStripeCustomer(user)).id;

      const stripeUser = Object.assign(user);

      const subscriptions = (
        await PaymentService.stripe.subscriptions.list({
          customer: stripeId,
          status: "all",
        })
      ).data;

      stripeUser.subscriptions = [];
      stripeUser.hasActiveSubscriptions = false;

      // all active subs and canceled but not ended
      const actives = subscriptions.filter(
        (sub) =>
          sub.status === "active" ||
          (sub.status === "canceled" &&
            sub.current_period_end * 1000 > Date.now())
      );

      for (const sub of actives) {
        const s = {
          id: sub.id,
          items: [],
        };

        /**
         *
         * @param {number} stamp Timestamp to convert
         * @returns Object with strings date
         */
        function dateObject(stamp) {
          return {
            strFull: strDate(stamp, true, true),
            strDate: strDate(stamp),
            strDateWithDay: strDate(stamp, true),
            strDateWithTime: strDate(stamp, false, true),
            date: dateFromStamp(stamp),
          };
        }

         const subEndTimestamp = sub.current_period_end * 1000;
         const subStartTimestamp = sub.current_period_start * 1000;

    
        s.subStart = dateObject(subStartTimestamp);
        s.subEnd = dateObject(subEndTimestamp);

        for (const item of sub.items.data) {
          const priceId = item.price.id;
          const productId = item.price.product;
          const product = await PaymentService.stripe.products.retrieve(
            productId
          );
          const productName = product.name;
          const productDescription = product.description;

          const obj = { priceId, productId, productDescription, productName };
          s.items.push(obj);
        }

        stripeUser.subscriptions.push(s);
      }

      stripeUser.hasActiveSubscriptions = actives.length > 0;
      return stripeUser;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = AuthService;
