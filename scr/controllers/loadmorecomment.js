const commentmodel=require('./../models/comment')

module.exports=async(req,res)=>{
try{

const courseid=req.params.courseid
const page=Math.max(Number(req.query.page)||1,1)
const limit=20
const skip=(page-1)*limit

const [comments,count]=await Promise.all([

commentmodel
.find({course:courseid})
.populate('user','name lastname')
.sort({createdAt:-1})
.skip(skip)
.limit(limit),

commentmodel.countDocuments({course:courseid})

])

return res.status(200).json({
success:true,
count,
page,
comments
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}