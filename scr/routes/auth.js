const express=require('express')
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
const turnstile=require('./../middlewares/turnstile')


route.post('/register',islogin,turnstile,registerValidator,validator,register.Register,register.checkotp)
route.post('/applyregister',islogin,register.applyregister)
route.post('/register/otp-again',islogin,register.tryotpagain)

route.post('/login',islogin,turnstile,loginValidator,validator,login)

route.post('/forgotpassword/enterphone',islogin,turnstile,forgotPhoneValidator,validator,forgotpassword.enterphone) 
route.post('/forgotpassword/otpagain',islogin,forgotpassword.otpagain)
route.post('/forgotpassword/entercode',islogin,forgotpassword.checkotp)


route.post('/changepassword',checklogin,changepasswordvalidator,validator,changepassword)

module.exports=route