const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
    try{
    const {userid}=req.params.id
    const user=await usermodel.findOne({_id:userid,verified:true})
   
    if(!user)
        return res.status(404).json({
        success:false,
        message:'کاربر پیدا نشد'})

    if(user.deleted){
        user.deleted=false
        await user.save()
        return res.status(200).json({
            success:true,
            message:'کاربر رفع مسدود شد'
        })
    }
    return res.status(409).json({
        success:false,
        message:'این کاربر مسدود نیست'
    })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'خطای سرور'
        })
    }
}