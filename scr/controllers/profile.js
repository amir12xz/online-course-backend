const usermodel=require('./../models/user')
const jwt=require('jsonwebtoken')

module.exports=async(req,res)=>{
    try{
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)

    const user=await usermodel.findOne({
        _id:decode.id,
        deleted:false,
        verified:true
    }).select('-password -avatar -verified -deleted -_id')

    if(user)
        return res.status(200).json({
    success:true,
    user:user})

    return res.status(404).json({
        success:false,
        user:null
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