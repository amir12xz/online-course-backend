const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')

module.exports=async(req,res,next)=>{
try{
const token=req.cookies.token
const decode=jwt.verify(token,process.env.JWT)
const user=await usermodel.findOne({
    _id:decode.id,
    role:'admin',
    verified:true,
    deleted:false
})
if(user&&user.role=='admin')
    return next()

return res.status(403).json({
success:false,
message:'کاربر وجود ندارد یا عدم دسترسی'
})

}catch(err){

        res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })
    
return res.status(401).json({
success:false,
message:'توکن نامعتبر'
})
}
}