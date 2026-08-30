const{body}=require("express-validator")

const otpValidator=[
    body("code")
        .isInt({min:10000,max:99999})
        .withMessage("کد باید یک عدد ۵ رقمی باشد")
]

module.exports=otpValidator