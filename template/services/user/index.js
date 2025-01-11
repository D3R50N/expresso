const { VerificationLink, Links, PasswordResetLink } = require("../../models/linkModel");
const ROUTES = require("../../routes/routes");
const LinkService = require("../link");
const MailService = require("../mail");
const RoutesService = require("../routes");

class UserService {
  constructor(user) {
    this.user = user;
  }

  static of(user) {
    return new UserService(user);
  }

  async sendVerificationEmail() {
    const userId = this.user.id;

    const available = await VerificationLink.find({ userId });
    var link = available.find((l) => !LinkService.hasExpired(l));

    if (!link) link = await LinkService.create(userId, Links.VERIFICATION);
    const url = `${RoutesService.host}${ROUTES.VERIFY_ACCOUNT}/${link.path}`;

    return await MailService.sendTemplateMail({
      subject: "Account Verification - [##NAME##]",
      template_path: "account-verification",
      template_var: {
        url: url,
        name: this.user.name,
      },
      to: [this.user.email],
    });
  }

  async sendPasswordResetEmail() {
    const userId = this.user.id;

    const available = await PasswordResetLink.find({ userId });
    var link = available.find((l) => !LinkService.hasExpired(l));

    if (!link) link = await LinkService.create(userId, Links.PASSWORD_RESET);
    const url = `${RoutesService.host}${ROUTES.RESET_PASSWORD}/${link.path}`;

    return await MailService.sendTemplateMail({
      subject: "Password Reset - [##NAME##]",
      template_path: "password-reset",
      template_var: {
        url: url,
        name: this.user.name,
      },
      to: [this.user.email],
    });
  }

  async verifyUser() {
    this.user.accountVerified = true;
    await this.user.save();
  }

  async resetPassword(newPwd) {
    this.user.password = newPwd;
    await this.user.save();
  }
}

module.exports = UserService;
