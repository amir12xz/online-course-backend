const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const sms=require('./../integrations/sms/farazsms')
const codemaker=require('./../utils/createotpcode')

module.exports.Register=async(req,res,next)=>{
try{
const {name,lastname,phone,password}=req.body

const check_phone=await usermodel.findOne({phone})

if(check_phone)
return res.status(401).json({
success:false,
message:'number exist in data base'
})

const hashed_pass=await bcrypt.hash(password,10)

await usermodel.create({
name,
lastname,
phone,
password:hashed_pass
})

const temptoken=jwt.sign(
{phone},
process.env.JWT,
{expiresIn:'4m'}
)

 res.cookie('temptoken',temptoken,{
 httpOnly:true
 })
req.temptoken=temptoken

return next()

}catch(err){
return res.status(500).json({
success:false,
message:err.message
})
}
}



module.exports.checkotp=async(req,res)=>{
try{

const token=req.temptoken
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
message:'otp sent'
})

}catch(err){
return res.status(401).json({
success:false,
message:err.message
})
}
}

module.exports.applyregister=async(req,res)=>{
try{

const otpbodycode=req.body.code
const token=req.cookies.temptoken
const payload=jwt.verify(token,process.env.JWT)


const otpcheck=await otpmodel.findOne({
phone:payload.phone,
code:otpbodycode,
used:false
})

if(!otpcheck)
return res.status(401).json({
success:false,
message:'invalid code'
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

user.verified=true
await user.save()

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

res.clearCookie('temptoken')

otpcheck.used=true
await otpcheck.save()

return res.status(200).json({
success:true,
message:'able to register'
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

const token=req.cookies.temptoken
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