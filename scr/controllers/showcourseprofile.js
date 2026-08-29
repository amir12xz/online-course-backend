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
            return res.status(404).json({
            success:false,
            message:'کاربر پیدا نشد'
        })

        const course=await coursemodel.findById(courseid)

        if(!course)
            return res.status(404).json({
            success:false,
            message:'همچین دوره ای وجود ندارد'
        })

        const enrollment=await enrollmentmodel.findOne({
            course:courseid,
            user:user._id,
            status:'success'
        })

        if(enrollment)
            return res.status(200).json({
             success:true,
             message:'دوره های کاربر',
             course,
             enrollment
            })

    return res.status(403).json({
      success:false,
      message:'کاربر در این دوره ثبت نام نشده است'
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