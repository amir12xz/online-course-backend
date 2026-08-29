const { body } = require("express-validator");

module.exports = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("لطفا پسوورد را وارد کنید").bail()

    .isLength({ min: 8, max: 64 })
    .withMessage("پسوورد باید بین 8 الی 64 کارکتر باشد").bail(),
];