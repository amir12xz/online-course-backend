const coursemodel=require('./../models/course')

module.exports=async(req, res)=>{
  try {
    const count=await coursemodel.countDocuments()

    return res.status(200).json({
      success:true,
      count
    })

  }catch(error){
    return res.status(500).json({
      success:false,
      message:'server error'
    })
  }
}