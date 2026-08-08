const coursemodel=require('./../models/course')
const commentmodel=require('./../models/comment')

module.exports=async(req,res)=>{
    const courseid=req.params.courseid
    const course=await coursemodel.findById(courseid)
    const comment=await commentmodel.find({course:courseid})

    if(comment||course)
        return res.status(200).json({
        success:true,
        message:'course and comments',
        course,
        comment
        })
}