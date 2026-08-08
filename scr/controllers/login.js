const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const sms=require('./../integrations/sms/farazsms')
const codemaker=require('./../utils/createotpcode')

module.exports.checkpass=async(req,res,next)=>{
try{
const {phone,password}=req.body

const user=await usermodel.findOne({phone,verified:true})

if(!user)
return res.status(401).json({
success:false,
message:'user not found'
})

const checkpass=await bcrypt.compare(password,user.password)

if(!checkpass)
return res.status(401).json({
success:false,
message:'wrong password'
})

const tempToken=jwt.sign(
{phone:user.phone},
process.env.JWT,
{expiresIn:'4m'}
)

res.cookie('tempToken',tempToken,{
    httpOnly:true
})

req.temptoken = tempToken

return next()

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}

module.exports.checkotp=async(req,res)=>{
try{

const token = req.temptoken
const payload=jwt.verify(token,process.env.JWT)

await otpmodel.deleteMany({
phone:payload.phone,
used:false
})

const otpcode=codemaker()

await otpmodel.create({
phone:payload.phone,
code:otpcode,
expiredAt:new Date(Date.now()+60*1000)
})

//await sms(otpcode,payload.phone)

return res.status(200).json({
success:true,
message:'otp code send'
})

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}

module.exports.applylogin=async(req,res)=>{
try{

const otpbodycode=req.body.code
const token=req.cookies.tempToken
const payload=jwt.verify(token,process.env.JWT)



const otpcheck=await otpmodel.findOne({
phone:payload.phone,
code:otpbodycode,
used:false
})

if(!otpcheck)
return res.status(401).json({
success:false,
message:'wrong code'
})

if(otpcheck.expiredAt<new Date())
return res.status(401).json({
success:false,
message:'otp expired'
})

const user=await usermodel.findOne({
phone:payload.phone
})

if(!user)
return res.status(404).json({
success:false,
message:'user not found'
})

const accessToken=jwt.sign(
{id:user._id},
process.env.JWT,
{expiresIn:'5d'}
)

res.cookie('token',accessToken,{
httpOnly:true,
secure:false,
sameSite:'lax'
})

otpcheck.used=true
await otpcheck.save()

res.clearCookie('tempToken')

return res.status(200).json({
success:true,
message:'able to login'
})

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}

module.exports.tryotpagain=async(req,res)=>{
try{

const token=req.cookies.tempToken
const payload=jwt.verify(token,process.env.JWT)

const otp = await otpmodel.findOne({
    phone:payload.phone,
    used:false
})

if (otp && otp.expiredAt > new Date()) {
    return res.status(401).json({
        success:false,
        message:"otp not expires yet"
    })
}

await otpmodel.deleteMany({
phone:payload.phone,
used:false
})


const otpcode=codemaker()

await otpmodel.create({
phone:payload.phone,
code:otpcode,
expiredAt:new Date(Date.now()+60*1000)
})

//await sms(otpcode,payload.phone)

return res.status(200).json({
success:true,
message:'otp sent again'
})

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}
//rate limit