const usermodel=require('./../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

module.exports=async(req,res)=>{
try{
        const {newpassword}=req.body
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)


    const user=await usermodel.findOne({_id:decode.id,verified:true,deleted:false}) 

    if(!user)
            return res.status(404).json({
            success:false,
            message:'کاربرپیدا نشد'
        }) 


     user.password=await bcrypt.hash(newpassword,10)
     await user.save()

        return res.status(200).json({
        success:true,
        message:'رمز ورود بروزرسانی شد'
    })
    

}catch(err){
     if (
            err.name === 'JsonWebTokenError' ||
            err.name === 'TokenExpiredError'
        ) {
            res.clearCookie('token', {
            httpOnly: true,
            secure: false,
           sameSite: 'lax'
})

            return res.status(401).json({
                success: false,
                message: 'توکن نامعتبر'
            })
        }

        console.log(err)

        return res.status(500).json({
            success: false,
            message: 'server error'
        })
}   
}