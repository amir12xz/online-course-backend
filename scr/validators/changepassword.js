const {body}=require('express-validator')

module.exports=[
         body().custom((value, { req }) => {
        const allowedFields = ['newpassword']
        const receivedFields = Object.keys(req.body);
        
         
        const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
        
        if (extraFields.length > 0) {
          throw new Error(`فیلدهای غیرمجاز: ${extraFields.join(', ')}`);
        }
        return true
      }),
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