const AppService = require("..");

class PaymentService {

    static #config = AppService.config;

    static stripe = this.#config.stripeSecretKey ? require('stripe')(this.#config.stripeSecretKey) : null;

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