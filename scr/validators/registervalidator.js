const {body}=require('express-validator')


module.exports=[

 body().custom((value, { req }) => {
    const allowedFields = ['name', 'lastname', 'phone', 'password'];
    const receivedFields = Object.keys(req.body);
    
    // فیلدهای اضافی رو پیدا کن
    const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
    
    if (extraFields.length > 0) {
      throw new Error(`فیلدهای غیرمجاز: ${extraFields.join(', ')}`);
    }
    return true;
  }),

body('name')
.trim()
.notEmpty()
.withMessage('نام را وارد کنید')
.bail(),


body('lastname')
.trim()
.notEmpty()
.withMessage('نام خانوادگی را وارد کنید')
.bail(),


body('phone')
.trim()
.notEmpty()
.withMessage('شماره تلفن همراه را وارد کنید').bail()
.isMobilePhone('fa-IR')
.withMessage('شماره نامعتبر است').bail(),


body('password')
.trim()
.notEmpty()
.withMessage('رمز عبور را وارد کنید').bail()
.isLength({ min: 8 })
.withMessage('رمز حداقل باید 8 کاراکتر باشد').bail()
.matches(/[A-Za-z]/)
.withMessage('رمز عبور باید شامل حداقل یک حرف انگلیسی باشد').bail()
.matches(/[0-9]/)
.withMessage('رمز عبور باید شامل حداقل یک عدد باشد').bail()

]