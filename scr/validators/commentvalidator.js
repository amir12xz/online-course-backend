// ===== validators/commentValidator.js =====

const { body } = require('express-validator')

module.exports = [

    body('text')
        .exists()
        .withMessage('فیلد متن کامنت وجود ندارد')
        .bail()

        .isString()
        .withMessage('متن کامنت باید از نوع رشته باشد')
        .bail()

        .trim()

        .notEmpty()
        .withMessage('متن کامنت را وارد کنید')
        .bail()

        .isLength({
            min: 3,
            max: 2000
        })
        .withMessage('متن کامنت باید بین ۳ تا ۲۰۰۰ کاراکتر باشد')
        .bail()

        .escape()
]