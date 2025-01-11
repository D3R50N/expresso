const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const AppService = require("..");

class MailService {
  static #config = AppService.config;

  static transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: this.#config.mailerUser,
      pass: this.#config.mailerPwd,
    },
  });

  static async sendMail({ to, subject, text, html }) {
    const options = {
      from: '"' + this.#config.mailerAppName + '" ' + this.#config.mailerUser,
      to: to.join(","),
      subject,
      text,
      html,
    };
    await this.transporter.sendMail(options);
  }

  static async sendTemplateMail({
    subject,
    template_path = "index",
    template_var = {},
    to = [],
  }) {
    try {
      if (!template_path.endsWith(".html")) template_path += ".html";

      var content = fs.readFileSync(
        path.join(__dirname, "template", template_path),
        { encoding: "utf-8" }
      );

      const receivers = [...to, ...this.#config.mailerReceivers];

      for (let key of Object.keys(template_var)) {
        content = content.replaceAll(
          new RegExp(`#{${key}}`, "ig"),
          template_var[key]
        );
      }

      await this.sendMail({
        to: receivers,
        subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static isEmail(email) {
    const r = /\S+@\S+\.\S+/;
    return r.test(email);
  }
}

module.exports = MailService;
