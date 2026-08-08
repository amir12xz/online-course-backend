const express=require('express')
const route=express.Router()

const checklog=require('./../middlewares/islogin')
const userdata=require('./../controllers/userdata')
const changename=require('./../controllers/changename')
const logout=require('../controllers/logout')
const deleteacount=require('./../controllers/deleteacount')
const showcourselesson=require('./../controllers/showcourseprofile')

route.get('/showprofile',checklog,userdata)
route.post('/changename',checklog,changename)
route.post('/logout',checklog,logout)
route.post('/deleteacc',checklog,deleteacount)
route.get('/showcourse',checklog,showcourselesson)


module.exports=route