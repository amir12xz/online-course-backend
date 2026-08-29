const enrollmentmodel=require('./../models/enrollment')

module.exports=async(req,res)=>{
    try {
        const courseid=req.params.courseid
        const page=Math.max(Number(req.query.page)||1,1)

        const limit=80

        const skip=(page-1)*limit

        const filter={
            course:courseid,
            status:'success'
        }


        const [enrollments, count]=await Promise.all([

            enrollmentmodel
                .find(filter)
                .populate({
                    path:'user',
                    select:'-password'
                })
                .skip(skip)
                .limit(limit),

            enrollmentmodel.countDocuments(filter)

        ])


        return res.status(200).json({
            success:true,
            count,
            enrollments
        })
    } catch(err){

        return res.status(500).json({

            success:false,
            message:'server error'

        })
    }
}