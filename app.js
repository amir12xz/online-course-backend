const express=require('express')
const helmet=require('helmet')
const cors=require('cors')
const hpp=require('hpp')
const path=require('path')
const mongosanitize = require('express-mongo-sanitize')
const cookieparser = require('cookie-parser')
const ratelimit = require('express-rate-limit')
require('dotenv').config()
const checkid=require('./scr/middlewares/checkmongodbobject')

//routers
const profile=require('./scr/routes/profile')
const auth=require('./scr/routes/auth')
const user=require('./scr/routes/user')
const mainpage=require('./scr/controllers/mainpage')
const getcourse=require('./scr/controllers/loadcoursepage')
const admin=require('./scr/routes/admin')
const getlicense=require('./scr/controllers/getlicense')
const islogin=require('./scr/middlewares/islogin')
const morecomments=require('./scr/controllers/loadmorecomment')


const app=express()

app.use(helmet({
crossOriginResourcePolicy:{
policy:'cross-origin'
}
}))                       
app.use(mongosanitize())      
app.use(hpp())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.static(path.join(__dirname,'scr','public')))

// const limiter = ratelimit({
//   windowMs:15*60*1000,  
//   max:100,                 
//   message:{
//     success:false,
//     message:'درخواست بیش از حد'
//   }
// })

// app.use('/api',limiter)


app.use(express.json({limit:'10kb',strict:true})) 
app.use((err, req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        error: 'JSON Invalid',
        message: 'JSON ارسالی ناقص یا نامعتبر است'
      });
    }
  }
  next();
});
app.use(express.urlencoded({extended:true }));
app.use(cookieparser())

//route

app.use('/api/profile',profile)
app.use('/api/auth',auth)
app.use('/api/user',user)
app.use('/api/admin',admin)

app.get('/api/getcourses',mainpage)
app.get('/api/getcourse/:courseid',checkid('courseid'),getcourse)
app.get('/api/getlicense/:courseId',checkid('courseId'),islogin,getlicense)
app.get('/api/morecomment/:courseid',checkid('courseid'),morecomments)

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:'صفحه مورد نظر پیدا نشد'
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