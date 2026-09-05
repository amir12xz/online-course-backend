const coursemodel=require('../models/course')
const usermodel=require('../models/user')
const enrollmentmodel=require('../models/enrollment')
const spot=require('../integrations/spotplayer/spot')

module.exports=async(req,res)=>{
try{
    const {courseId,userId}=req.params
    const user=await usermodel.findOne({_id:userId,deleted:false,verified:true})
    const course=await coursemodel.findById(courseId)

    if(!user)
        return res.status(404).json({
            success:false,
            message:'کاربرپیدا نشد'
        }) 
    
    if(!course)
        return res.status(404).json({
            success:false,
            message:'دوره پیدا نشد'
        })

//     const spotplayer=await spotplayer(
//          user.name,
//          course.spotplayercourseid,
//         user.phone
// )

// if(!spotplayer||!spotplayer.key)
//     return res.status(504).json({
// success:false,
// message:'اسپات پلیر جواب نداد'})
const checkenrollment=await enrollmentmodel.findOne({
    user:user._id,
    course:course._id
})

if(checkenrollment?.status=='success')
    return res.status(409).json({
success:false,
message:'کاربر قبلا در این دوره ثبت نام شده'})


if(checkenrollment?.status=='pending')
    return res.status(409).json({
        success:false,
        message:'ثبت نام این کاربر ناقص است از پنل ثبت نام ناقص اقدام به ثبت نام کنید'
    })





    await enrollmentmodel.create({
        user:user._id,
        course:course._id,
        status:'success',
      //  plicencs:spotplayer.key
    })
    return res.status(200).json({
        success:true,
        message:'کاربر به دوره اضافه شد'
    })
}catch(err){
return res.status(500).json({
success:false,
message:'server error'
})
}
}