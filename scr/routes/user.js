const express=require('express')
const checklog=require('./../middlewares/islogin')
const pay=require('./../controllers/pay')
const comment=require('./../controllers/postcomment')
const commentvalidator=require('./../validators/commentvalidator')
const checkid=require('./../middlewares/checkmongodbobject')
const enrollment=require('./../controllers/enrollment')

const route=express.Router()

route.get('/paycourse/:courseid',checkid('courseid'),checklog,pay)
route.post('/sendcomment/:courseid',checkid('courseid'),checklog,commentvalidator,comment)
route.get('/enrollmentuser',enrollment)


module.exports=route