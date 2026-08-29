const coursemodel=require('./../models/course')
const commentmodel=require('./../models/comment')
const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{
try{

const courseid=req.params.courseid

const course=await coursemodel.findById(courseid)

if(!course){
return res.status(404).json({
success:false,
message:'دوره پیدا نشد'
})
}

const [comment,commentcount]=await Promise.all([

commentmodel
.find({course:courseid})
.sort({createdAt:-1})
.populate('user','name lastname')
.limit(20),

commentmodel.countDocuments({
course:courseid
})

])

const result=await enrollmentmodel.aggregate([
{
$match:{
course:course._id,
status:'success'
}
},
{
$lookup:{
from:'users',
localField:'user',
foreignField:'_id',
as:'user'
}
},
{
$unwind:'$user'
},
{
$match:{
'user.verified':true,
'user.deleted':false
}
},
{
$count:'count'
}
])

const enrollmentcount=result[0]?.count||0

return res.status(200).json({
success:true,
message:'دوره و نظرات',
course,
comment,
enrollmentcount,
commentcount
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}