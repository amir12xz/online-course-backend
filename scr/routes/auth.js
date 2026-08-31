const express=require('express')
const rateLimit = require('express-rate-limit')
const route=express.Router()

const login=require('./../controllers/login')
const register=require('./../controllers/register')
const registerValidator=require('./../validators/registervalidator')
const loginValidator=require('./../validators/loginvalidator')
const validator=require('./../middlewares/validator')
const forgotpassword=require('./../controllers/forgotpassword')
const forgotPhoneValidator=require("./../validators/forgotpassphone")
const islogin=require('./../middlewares/checkabletologin')
const changepasswordvalidator=require('./../validators/changepassword')
const changepassword=require('./../controllers/changepassword')
const checklogin=require('./../middlewares/islogin')
const otpvalidator=require('./../validators/otpvalidator')
// const turnstile=require('./../middlewares/turnstile')

const authLimiter = rateLimit({
    windowMs:15*60*1000,
    max:10,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        message:'تعداد درخواست‌ها بیش از حد مجاز است'
    }
})
const otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false
})


route.post('/register',islogin/*,turnstile*/,registerValidator,validator,register.Register,register.checkotp)
route.post('/applyregister',islogin,otpvalidator,validator,register.applyregister)
route.post('/register/otp-again',islogin,otpLimiter,register.tryotpagain)

route.post('/login',islogin,authLimiter/*,turnstile*/,loginValidator,validator,login)

route.post('/forgotpassword/enterphone',islogin,forgotPhoneValidator,validator,forgotpassword.enterphone) 
route.post('/forgotpassword/otpagain',islogin,otpLimiter,forgotpassword.otpagain)
route.post('/forgotpassword/entercode',islogin,otpvalidator,validator,forgotpassword.checkotp)


route.post('/changepassword',checklogin,changepasswordvalidator,validator,changepassword)

module.exports=route