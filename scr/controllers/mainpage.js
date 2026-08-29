const coursemodel=require('./../models/course')

module.exports=async(req,res)=>{
try{

const courses=await coursemodel.aggregate([
{
$lookup:{
from:'enrollments',
let:{courseid:'$_id'},
pipeline:[
{
$match:{
$expr:{
$and:[
{$eq:['$course','$$courseid']},
{$eq:['$status','success']}
]
}
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
],
as:'enrollmentdata'
}
},
{
$addFields:{
enrollmentcount:{
$ifNull:[
{$arrayElemAt:['$enrollmentdata.count',0]},
0
]
}
}
},
{
$project:{
enrollmentdata:0
}
}
])

return res.status(200).json({
success:true,
courses
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})
}
}