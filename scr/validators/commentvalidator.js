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
        
        .isLength({ max: 1000 })
        .withMessage('متن کامنت نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد')
        .bail()
 

        .escape()
]