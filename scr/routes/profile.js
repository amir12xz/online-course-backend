const express=require('express')
const route=express.Router()

const checklog=require('./../middlewares/islogin')
const userdata=require('./../controllers/userdata')
const logout=require('../controllers/logout')
const userprofile=require('./../controllers/profile')

route.get('/showprofile',checklog,userdata)
route.get('/logout',checklog,logout)
route.get('/me',checklog,userprofile)


module.exports=route