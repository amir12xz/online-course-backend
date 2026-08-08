const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const coursemodel=require('./../models/course')
const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{

    try{
        const token=req.cookies.token
        const decode=jwt.verify(token,process.env.JWT)
        const courseid=req.params.courseid

        const user=await usermodel.findById(decode.id)

        if(!user)
            return res.status(401).json({
            success:false,
            message:'user not found'
        })

        const course=await coursemodel.findById(courseid)

        if(!course)
            return res.status(401).json({
            success:false,
            message:'course is not exist'
        })

        const enrollment=await enrollmentmodel.findOne({
            course:courseid,
            user:user._id,
            status:'success'
        })

        if(enrollment)
            return res.status(200).json({
             success:true,
             message:'user course:',
             enrollment
            })

    return res.status(401).json({
      success:false
    })

    }catch(err){
        return res.status(401).json({
      success:false,
      message:'invalid token'
    })
    }
}