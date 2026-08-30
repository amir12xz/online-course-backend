const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const coursemodel=require('./../models/course')
const commentmodel=require('./../models/comment')

module.exports=async(req, res)=>{
    try {

        const courseid=req.params.courseid
        const token=req.cookies.token
        const text=req.body.text

        const decode=jwt.verify(token, process.env.JWT)

const user=await usermodel.findOne({
    _id:decode.id,
    verified:true,
    deleted:false
})

        const course=await coursemodel.findById(courseid)

        if (!user||!course) {
            return res.status(404).json({
                success:false,
                message:'دوره یا کاربر پیدا نشد'
            })
        }

        if (!text||!text.trim()) {
            return res.status(400).json({
                success:false,
                message:'متن کامنت نامعتبر است'
            })
        }

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const checkcomment=await commentmodel.findOne({
            user:user._id,
            course:course._id,
            createdAt:{$gte:startOfDay}
        })
        if(checkcomment){
            return res.status(429).json({
            success:false,
            message:'شما امروز برای این دوره قبلاً کامنت گذاشته‌اید'
  })
        }

        await commentmodel.create({
            user:user._id,
            course:course._id,
            text:text.trim()
        })

        return res.status(200).json({
            success:true,
            message:'کامنت ارسال شد'
        })

    } catch(err){

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