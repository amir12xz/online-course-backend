const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
try{
const token=req.cookies.token
if(!token)
return res.status(401).json({
success:false,
message:'please login'
})

const decode=jwt.verify(token,process.env.JWT)

req.userId=decode.id

return next()

}catch(err){
return res.status(401).json({
success:false,
message:'invalid token'
})
}
}