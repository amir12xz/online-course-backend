const { body } = require("express-validator");

module.exports = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")

    .isLength({ min: 8, max: 64 })
    .withMessage("password must be between 8 and 64 characters"),
];