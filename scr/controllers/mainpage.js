const coursemodel=require('./../models/course')

module.exports=async(req,res)=>{
    const course=await coursemodel.find({})

    return res.status(200).json({
        success:true,
        message:'courses',
        course
    })
}