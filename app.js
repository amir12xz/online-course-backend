const express=require('express')
const helmet=require('helmet')
const cors=require('cors')
const hpp=require('hpp')
const mongosanitize = require('express-mongo-sanitize')
const cookieparser = require('cookie-parser')
const ratelimit = require('express-rate-limit')
require('dotenv').config()


const app=express()

app.use(helmet())                         
app.use(mongoSanitize())      
app.use(hpp())

const limiter = ratelimit({
  windowMs:15*60*1000,  
  max:100,                 
  message:{
    success:false,
    message:'many requests'
  }
})

app.use('/api',limiter)

app.use(express.json({limit:'10kb'})) 
app.use(express.urlencoded({extended:true }));
app.use(cookieparser())

//route


app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:'web page not found'
    })
})


app.use((err, req, res, next)=>{
  console.error(err.stack)
  res.status(err.statusCode||500).json({
    success:false,
    message:err.message||'server error'
  })
})


module.exports=app