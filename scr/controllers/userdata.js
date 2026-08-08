const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{
    try{
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)


    const user=await usermodel.findById(decode.id).select('-password ')
    const course=await enrollmentmodel.find({user:user._id,status:'success'}).populate('course')

    if(user.verified){
    const userdata = user.toObject()
    delete userdata.verified
 return res.status(200).json({
    success:true,
    message:'user found',
    userdata:userdata,
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