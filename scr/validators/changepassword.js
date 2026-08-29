const {body}=require('express-validator')

module.exports=[
body('newpassword')
    .notEmpty()
    .withMessage('رمز عبور جدید را وارد کنید').bail()
    .isLength({ min: 8 })
    .withMessage('رمز حداقل باید 8 کاراکتر باشد').bail()
    .matches(/[A-Za-z]/)
    .withMessage('رمز عبور باید شامل حداقل یک حرف انگلیسی باشد').bail()
    .matches(/[0-9]/)
    .withMessage('رمز عبور باید شامل حداقل یک عدد باشد').bail()
]