const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')

module.exports=async(req,res,next)=>{
try{
const token=req.cookies.token
const decode=jwt.verify(token,process.env.JWT)
const user=await usermodel.findOne({_id:decode.id,verified:true})

if(!user)
return res.status(401).json({
success:false,
message:'لطفا وارد شوید'
})

if(user.deleted){
        res.clearCookie('token',{
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    return res.status(409).json({
        success:false,
        message:'اکانت شما مسدود شد'
    })
}


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