const express=require('express')
const route=express.Router()

const login=require('./../controllers/login')
const register=require('./../controllers/register')
const registerValidator=require('./../validators/registervalidator')
const loginValidator=require('./../validators/loginvalidator')
const validator=require('./../middlewares/validator')
const forgotpassword=require('./../controllers/forgotpassword')
const forgotPhoneValidator=require("./../validators/forgotpassphone")
const resetPasswordValidator=require("./../validators/forgotpasspassword")


route.post('/register',registerValidator,validator,register.Register,register.checkotp)
route.post('/applyregister',register.applyregister)
route.get('/register/otp-again',register.tryotpagain)

route.post('/login',loginValidator,validator,login.checkpass,login.checkotp)
route.post('/applylogin',login.applylogin)
route.get('/login/otp-again',login.tryotpagain)

route.post('/forgotpassword/enterphone',forgotPhoneValidator,validator,forgotpassword.enterphone)
route.post('/forgotpassword/entercode',forgotpassword.checkotp)
route.post('/forgotpassword/resetpass',resetPasswordValidator,validator,forgotpassword.resetpass)

module.exports=route