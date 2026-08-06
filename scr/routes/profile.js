const express=require('express')
const route=express.Router()

const checklog=require('./../middlewares/islogin')
const userdata=require('./../controllers/userdata')
const changename=require('./../controllers/changename')

route.get('/showprofile',checklog,userdata)
route.post('/changename',checklog,changename)


module.exports=route