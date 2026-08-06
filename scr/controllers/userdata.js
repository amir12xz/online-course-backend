const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{
    try{
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)

    if(!decode)
        return res.status(401).json({
    success:false,
    message:'token expired or invalid'
        })

    const user=await usermodel.findById(decode.id).select('-password')
    const course=await enrollmentmodel.find({user:user._id}).populate('course')

    if(user.verified){
 return res.status(200).json({
    success:true,
    message:'user found',
    userdata:user,
    courses:course
 })
    }else
        return res.status(401).json({
            success:false,
            message:'user not found'
        })
       

    }catch(err){
return res.status(401).json({
      success:false,
      message:'invalid token'
    })
    }
}