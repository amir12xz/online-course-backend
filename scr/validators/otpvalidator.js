const{body}=require("express-validator")

const otpValidator=[
 body().custom((value, { req }) => {
    const allowedFields = ['code']
    const receivedFields = Object.keys(req.body);
    
     
    const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
    
    if (extraFields.length > 0) {
      throw new Error(`فیلدهای غیرمجاز: ${extraFields.join(', ')}`);
    }
    return true
  }),
    body("code")
        .isInt({min:10000,max:99999})
        .withMessage("کد باید یک عدد ۵ رقمی باشد")
]

module.exports=otpValidator