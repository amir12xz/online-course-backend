const express=require('express')
const route=express.Router()

const login=require('./../controllers/login')
const register=require('./../controllers/register')
const registerValidator=require('./../validators/registervalidator')
const loginValidator=require('./../validators/loginvalidator')
const validator=require('./../middlewares/validator')

route.post('/register',registerValidator,validator,register.Register,register.checkotp)
route.post('/applyregister',register.applyregister)
route.post('/register/otp-again',register.tryotpagain)

route.post('/login',loginValidator,validator,login.checkpass,login.checkotp)
route.post('/applylogin',login.applylogin)
route.post('/login/otp-again',login.tryotpagain)

module.exports=route