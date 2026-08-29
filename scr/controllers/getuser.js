const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
try{
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)

    const user=await usermodel.findOne({
    _id:decode.id,
    verified:true,
    deleted:false
}).select('-password -verified -avatar -deleted')

    if(user)
        return res.status(200).json({
        success:true,
        message:'کاربر پیدا شد',
        user})

return res.status(404).json({
    success:false,
    message:'کاربر پیدا نشد'
})
}catch(err){
return res.status(500).json({
success:false,
message:'server error'
})
}
}