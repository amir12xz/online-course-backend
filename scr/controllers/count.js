const usermodel=require('./../models/user')
const coursemodel=require('./../models/course')

module.exports.usercount=async(req,res)=>{
        try {
        const count=await usermodel.countDocuments({ verified: true,deleted:false })

        return res.status(200).json({
            success:true,
            count
        })

    } catch (err) {
        return res.status(500).json({
            success:false
        })
    }
}

module.exports.coursecount=async(req,res)=>{
        try {
        const count=await coursemodel.countDocuments({})

        return res.status(200).json({
            success:true,
            count
        })

    } catch (err) {
        return res.status(500).json({
            success:false
        })
    }
}