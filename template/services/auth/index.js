const jwt = require("jsonwebtoken");
const AppService = require("..");
const User = require("../../models/userModel");

// const { getDateInfo, strDate, dateFromStamp } = require("./date");
const CookieService = require("../cookies");
const PaymentService = require("../payment");
const UploadService = require("../upload");

class AuthService {


    static #config = AppService.config;

    static generateToken = (user) => {
        return jwt.sign({ userId: user._id }, this.#config.jwtSecret, { expiresIn: this.#config.jwtMaxDate });
    };

    static async authUser(req, withStripe = false) {

        const token = CookieService.from(req, null).get(this.#config.authToken);

        if (!token) {
            return null;
        }
        try {
            const decoded = await jwt.verify(token, this.#config.jwtSecret);
            req.headers.authorization = token;
            req.user = decoded;
            const user = await User.findById(req.user.userId);
            if (!user) return null;


            const attributes = { ...user._doc, };

            if (!withStripe) return { model: user, ...attributes, }


            var stripeId = user.stripeId ?? (await PaymentService.createStripeCustomer(user)).id;
            const subscriptions = (await PaymentService.stripe.subscriptions.list({
                customer: stripeId
            })).data;

            attributes.subscriptions = [];
            attributes.hasActiveSubscriptions = false;


            const actives = subscriptions.filter(sub => sub.status === "active");
            for (const sub of actives) {
                const s = {
                    id: sub.id,
                    items: [],
                };

                const subEndTimestamp = sub.current_period_end * 1000
                const subStartTimestamp = sub.current_period_start * 1000
                s.subEnd = {
                    strFull: strDate(subEndTimestamp, true, true),
                    strDate: strDate(subEndTimestamp),
                    strDateWithDay: strDate(subEndTimestamp, true),
                    strDateWithTime: strDate(subEndTimestamp, false, true),
                    date: dateFromStamp(subEndTimestamp)
                };
                s.subStart = {
                    strFull: strDate(subStartTimestamp, true, true),
                    strDate: strDate(subStartTimestamp),
                    strDateWithDay: strDate(subStartTimestamp, true),
                    strDateWithTime: strDate(subStartTimestamp, false, true),
                    date: dateFromStamp(subStartTimestamp)
                };


                const sub_items = sub.items.data;

                for (const item of sub_items) {
                    const priceId = item.price.id;
                    const productId = item.price.product;
                    const product = await PaymentService.stripe.products.retrieve(productId);
                    const productName = product.name;
                    const productDescription = product.description;

                    const obj = { priceId, productId, productDescription, productName }
                    s.items.push(obj);
                }


                attributes.subscriptions.push(s);
            }



            attributes.hasActiveSubscriptions = actives.length > 0;
            return { ...attributes, model: user };
        } catch (err) {
            console.log(err);
            return null;
        }
    }

}


module.exports = AuthService;

