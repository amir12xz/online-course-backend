const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const sms=require('./../integrations/sms/farazsms')
const codemaker=require('./../utils/createotpcode')
const loginhistorymodel=require('./../models/loginhistory')

module.exports=async(req,res)=>{
try{
const {phone,password}=req.body


const user=await usermodel.findOne({phone})

if(!user)
    return res.status(401).json({
        success:false,
        message:'شماره موبایل یا رمز عبور اشتباه است'
    })

if (user?.deleted){
    return res.status(403).json({
        success:false,
        message:'حساب کاربری شما مسدود شده است'
    })
}

if (!user.verified) {
    return res.status(401).json({
        success: false,
        message: 'شماره موبایل یا رمز عبور اشتباه است'
    })
}

const checkpass=await bcrypt.compare(password, user.password)

if(!checkpass)
    return res.status(401).json({
        success:false,
        message:'شماره موبایل یا رمز عبور اشتباه است'
    })

const accessToken=jwt.sign(
{id:user._id
},
process.env.JWT,
{expiresIn:'30d'}
)

res.cookie('token',accessToken,{
httpOnly:true,
secure:false,
sameSite:'lax',
maxAge:30*24*60*60*1000
})
await loginhistorymodel.create({
    user: user._id
})
return res.status(200).json({
success:true,
message:'ورود موفقیت آمیز'
})

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}



