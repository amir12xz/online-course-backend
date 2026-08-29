const {body}=require('express-validator')


module.exports=[

 body().custom((value, { req }) => {
    const allowedFields = ['phone','password'];
    const receivedFields = Object.keys(req.body);
    
    // فیلدهای اضافی رو پیدا کن
    const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
    
    if (extraFields.length > 0) {
      throw new Error(`فیلدهای غیرمجاز: ${extraFields.join(',')}`);
    }
    return true;
  }),

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

]