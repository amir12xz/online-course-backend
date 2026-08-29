const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
try{
    const {phone}=req.params
    const user=await usermodel.findOne({
        phone,
        verified:true,
        deleted:false
    }).select('-password')

    if(!user)
        return res.status(404).json({
        success:false,
        message:'کاربر پیدا نشد'})

    return res.status(200).json({
        success:true,
        user
    })
}catch(err){
return res.status(500).json({
    success:false,
    message:'server error'
})
}
}