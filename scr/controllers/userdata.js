const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{
    try{
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)


    const user=await usermodel.findOne({_id:decode.id,verified:true,deleted:false}).select('-password')

    if(!user)
            return res.status(404).json({
            success:false,
            message:'کاربرپیدا نشد'
        })    

    const course=await enrollmentmodel.find({user:user._id,status:{$in:['success','pending']}}).populate('course','-price')

    if(user.verified){
    const userdata = user.toObject()
    delete userdata.verified

    if(user.role=='admin')
    return res.status(200).json({
    success:true,
    role:'admin',
    message:'user found',
    userdata:userdata,
 })

 return res.status(200).json({
    success:true,
    role:'user',
    message:'user found',
    userdata:userdata,
    coursedata:course
 })
    }else
        return res.status(404).json({
            success:false,
            message:'کاربر پیدا نشد'
        })
       

    }catch(err){
    if (
            err.name === 'JsonWebTokenError' ||
            err.name === 'TokenExpiredError'
        ) {
           res.clearCookie('token', {
           httpOnly: true,
           secure: false,
           sameSite: 'lax'
})

            return res.status(401).json({
                success: false,
                message: 'توکن نامعتبر'
            })
        }

        console.log(err)

        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}