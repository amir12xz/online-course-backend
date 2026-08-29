const usermodel=require('./../models/user')

module.exports=async(req, res)=>{
  try {
    const {userid}=req.params

    const user=await usermodel.findOne({
      _id: userid,
      verified:true,
      deleted:false
    }).select('name lastname phone role')

    if (!user){
      return res.status(404).json({
        success:false,
        message:'کاربر پیدا نشد'
      })
    }

    return res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'server error'
    })
  }
}