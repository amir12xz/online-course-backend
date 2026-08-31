const usermodel = require('./../models/user')

module.exports=async(req,res)=>{
try{
const id=req.params.id
const user=await usermodel.findOneAndUpdate(
    {
        _id:id,
        verified:true,
        role:{$ne:'admin' }
    },
    {
        $set:{
            deleted:true
        }
    }
)

if (!user){
    return res.status(404).json({
        success:false,
        message:'کاربر وجود ندارد یا امکان بن کردن او وجود ندارد'
    })
}


return res.status(200).json({
    success:true,
    message:'حساب کاربری بن شد'
})

}catch(err){


        return res.status(500).json({
            success: false,
            message: 'server error'
        })
}
}