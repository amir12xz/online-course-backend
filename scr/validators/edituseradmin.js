const { body } = require('express-validator')

module.exports = [
  body('name')
    .trim()
    .notEmpty().withMessage('نام را وارد کنید').bail()
    .isLength({ min: 2, max: 50 }).withMessage('نام باید بین ۲ تا ۵۰ کاراکتر باشد'),

  body('lastname')
    .trim()
    .notEmpty().withMessage('نام خانوادگی را وارد کنید').bail()
    .isLength({ min: 2, max: 50 }).withMessage('نام خانوادگی باید بین ۲ تا ۵۰ کاراکتر باشد'),

  body('phone')
    .trim()
    .notEmpty().withMessage('شماره تلفن همراه را وارد کنید').bail()
    .isMobilePhone('fa-IR').withMessage('شماره موبایل نامعتبر است'),

  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 8 }).withMessage('رمز حداقل باید ۸ کاراکتر باشد').bail()
    .matches(/[A-Za-z]/).withMessage('رمز عبور باید شامل حداقل یک حرف انگلیسی باشد').bail()
    .matches(/[0-9]/).withMessage('رمز عبور باید شامل حداقل یک عدد باشد')
]