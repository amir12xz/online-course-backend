const { body } = require("express-validator");

module.exports = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("شماره تلفن همراه را وارد کنید").bail()

    .isMobilePhone("fa-IR")
    .withMessage("شماره نامعتبر است").bail(),
];