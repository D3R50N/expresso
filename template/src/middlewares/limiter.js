const LangService = require("../services/lang");

const MAX_LIMIT = 10;
const requests = {};
const TIME_DELAY = 1 * 60 * 1000; // 1 min

const Limiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const now = Date.now();

        if (!requests[ip]) {
            requests[ip] = {
                count: 0,
                lastTime: now,
            };
            return next();
        }

        const delay = now - requests[ip].lastTime;
        if (delay < TIME_DELAY) {
            requests[ip].count++;
        } else {
            requests[ip] = {
                count: 0,
                lastTime: now,
            };
        }

        if (requests[ip].count > MAX_LIMIT) {
            if (!res.locals.tr) {
                LangService.tr(req, res, function () { });
            }
            LangService.setVars(res, {
                time: Math.round(delay / 1000),
            })
            return res.send(res.locals.tr.req_limit_reached);
        }

        return next();
    } catch (err) {
        return res.redirect("back");
    }
};

module.exports = Limiter;
