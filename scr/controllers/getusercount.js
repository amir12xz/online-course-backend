const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
try {
       const count = await usermodel.countDocuments({
      verified:true,
      deleted:false
    })

    return res.status(200).json({
      success:true,
      count
    }) 
} catch (error){
  return res.status(500).json({
success:false,
message:'server error'
})  
}
}