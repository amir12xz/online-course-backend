const usermodel=require('./../models/user')
const enrollmentmodel=require('./../models/enrollment')
const jwt=require('jsonwebtoken')

module.exports=async(req,res)=>{
try{
const courseid=req.params.courseId
const token=req.cookies.token
const decode=jwt.verify(token,process.env.JWT)

const user=await usermodel.findOne({
_id:decode.id,
verified:true,
deleted:false
}).select('-password')

if(!user){
return res.status(404).json({
success:false,
message:'کاربرپیدا نشد'
})
}

const course=await enrollmentmodel
.findOne({
course:courseid,
user:user._id
})
.select('plicencs status')

if(course){
return res.status(200).json({
success:true,
plicencs: course.plicencs,
status: course.status
})
}

return res.status(404).json({
success:false,
message:'دوره یافت نشد یا کاربر در این دوره ثبت نام نشده است'
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}