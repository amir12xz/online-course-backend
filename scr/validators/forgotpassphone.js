const { body } = require("express-validator");

module.exports = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")

    .isMobilePhone("fa-IR")
    .withMessage("invalid phone number"),
];