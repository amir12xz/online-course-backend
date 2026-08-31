const express=require('express')
const rateLimit = require('express-rate-limit')

const checklog=require('./../middlewares/islogin')
const pay=require('./../controllers/pay')
const comment=require('./../controllers/postcomment')
const commentvalidator=require('./../validators/commentvalidator')
const checkid=require('./../middlewares/checkmongodbobject')
const enrollment=require('./../controllers/enrollment')
const validator=require('./../middlewares/validator')

const route=express.Router()

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
})

route.post('/paycourse/:courseid',checkid('courseid'),checklog,paymentLimiter,pay)
route.post('/sendcomment/:courseid',checkid('courseid'),checklog,commentvalidator,validator,comment)
route.get('/enrollmentuser',enrollment)


module.exports=route