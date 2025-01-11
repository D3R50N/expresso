const { VerificationLink, PasswordResetLink, Link, Links } = require("../../models/linkModel");
const Utils = require("../../utils");
const DateService = require("../date");

class LinkService {


  static async create(
    userId,
    type,
    expireIn = { h: 1, s: 0, m: 0, ms: 0, d: 0 }
  ) {
    var link;
    switch (type) {
      case Links.VERIFICATION:
        link = new VerificationLink();
        break;
      case Links.PASSWORD_RESET:
        link = new PasswordResetLink();
        break;

      default:
        link = new Link();
        break;
    }
    link.path = `${Utils.generateRandomString()}-${Date.now()}-${Utils.generateRandomString()}-${Utils.generateRandomString()}`;

    link.userId = userId;

    const { h, s, m, ms, d } = expireIn;
    link.expireAt = DateService.addToDate({ h, s, m, ms, d });

    await link.save();
    return link;
  }

  static async expire(link) {
    link.expireAt = Date.now();
    await link.save();
    return link;
  }

  static async verify(link, userId) {
    if (!link || this.hasExpired(link) || link.userId != userId) return false;

    await this.expire(link);
    return true;
  }

  static hasExpired(link) {
    return DateService.isBeforeNow(link.expireAt);
  }
}

module.exports = LinkService;
