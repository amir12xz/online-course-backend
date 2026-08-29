const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
try{
const token=req.cookies.token
if(!token)
return res.status(401).json({
success:false,
message:'لطفا وارد شوید'
})

const decode=jwt.verify(token,process.env.JWT)

 

return next()

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