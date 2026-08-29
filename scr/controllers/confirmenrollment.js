const enrollmentmodel=require('./../models/enrollment')
const spotplayer=require('./../integrations/spotplayer/spot')

module.exports=async(req,res)=>{
try{

const enrollmentid=req.params.enrollmentid

const enrollment=await enrollmentmodel.findById(enrollmentid)
.populate('user','name phone')
.populate('course','spotplayercourseid')

if(enrollment){

if(enrollment.status==='success'){
return res.status(409).json({
success:false,
message:'کاربر قبلا  ثبت نام شده است'
})
}
if (!enrollment.user || !enrollment.course) {
    return res.status(404).json({
        success: false,
        message: 'کاربر یا دوره پیدا نشد'
    })
}

if(enrollment.plicencs)
        return res.status(404).json({
        success: false,
        message:'لایسنس وجود دارد '
    })

let license=await spotplayer(
enrollment.user.name,
enrollment.course.spotplayercourseid,
enrollment.user.phone
)

if(license.key){

enrollment.plicencs=license.key
enrollment.status='success'

await enrollment.save()

return res.status(200).json({
success:true,
message:'ثبت نام دوره موفقیت آمیز بود'
})

}else{

return res.status(502).json({
success:false,
message:'مشکل اسپات پلیر'
})

}

}

return res.status(404).json({
success:false,
message:'ثبت نام ناقصی پیدا نشد'
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}