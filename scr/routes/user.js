const express=require('express')
const checklog=require('./../middlewares/islogin')
const pay=require('./../controllers/pay')
const enrollment=require('./../controllers/enrollment')

const route=express.Router()

route.post('/paycourse/:courseid',checklog,pay)
route.get('/enrollmentuser',enrollment)

module.exports=route