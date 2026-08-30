const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const sms=require('./../integrations/sms/farazsms')
const codemaker=require('./../utils/createotpcode')

module.exports.Register=async(req,res,next)=>{
try{
    const token=req.cookies.temptoken;

if (token){
    try {
        const payload=jwt.verify(token, process.env.JWT);

        if (payload?.phone) {
            return res.status(409).json({
                success:false,
                message:'یک فرآیند ثبت نام در حال انجام است'
            })
        }

    }catch(err){

        if(err.name==='TokenExpiredError'){
            
            res.clearCookie('temptoken')
        }else{
         
            res.clearCookie('temptoken')
        }
    }
}

const {name,lastname,phone,password}=req.body

const check_phone=await usermodel.findOne({phone})
const hashed_pass=await bcrypt.hash(password,10)
const checkotp=await otpmodel.findOne({phone,used:false})


if(checkotp)
   return res.status(409).json({
success:false,
message:'کد قبلا ارسال شده'})

if (check_phone?.deleted) {
    return res.status(409).json({
        success: false,
        message:'این شماره تلفن در این سایت مسدود شده است'
    })
}


if (check_phone) {
    if (check_phone.verified) {
        return res.status(409).json({
            success:false,
            message:'با این شماره قبلا وارد شده اید '
        })
    }

    if(!check_phone.verified){
     check_phone.name = name
    check_phone.lastname = lastname
    check_phone.password = hashed_pass
    check_phone.deleted = false

    await check_phone.save()

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
    }
}
 


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
message:'کد ورود برای شما ارسال شد'
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


const otpcheck=await otpmodel.findOneAndUpdate(
    {
        phone:payload.phone,
        code:otpbodycode,
        used:false,
        expiredAt:{$gt:new Date()}
    },
    {
        $set:{used:true}
    },
    {
        new:true
    }
)

if(!otpcheck)
return res.status(400).json({
    success:false,
    message:'کد نامعتبر یا منقضی شده است'
})

const user=await usermodel.findOne({
phone:payload.phone
})

if(!user)
return res.status(404).json({
success:false,
message:'کاربر پیدا نشد'
})

user.verified=true
await user.save()

const accessToken=jwt.sign(
{id:user._id},
process.env.JWT,
{expiresIn:'30d'}
)

res.cookie('token',accessToken,{
httpOnly:true,
secure:false,
sameSite:'lax',
maxAge:30*24*60*60*1000
})

res.clearCookie('temptoken', {
    httpOnly:true
})


return res.status(200).json({
success:true,
message:'ثبت نام تکمیل شد'
})

}catch(err){

    if (err.name==='TokenExpiredError'||err.name==='JsonWebTokenError'){

        res.clearCookie('temptoken', {
            httpOnly:true
        })

        return res.status(401).json({
            success: false,
            message:'مدت ثبت نام به پایان رسیده است'
        })
    }

    return res.status(401).json({
        success:false,
        message:err.message
    })
}
}

module.exports.tryotpagain=async(req,res)=>{
try{

const token=req.cookies.temptoken
        if (!token) {
            res.clearCookie('temptoken', {
            httpOnly:true
        })
            return res.status(401).json({
                success: false,
                message: 'مهلت ثبت نام به اتمام رسیده است'
            })
            
        }
const payload=jwt.verify(token,process.env.JWT)

const otp = await otpmodel.findOne({
    phone:payload.phone,
    used:false
})

if (otp && otp.expiredAt > new Date()) {
    return res.status(409).json({
        success:false,
        message:"کد قبلی منقضی نشده است"
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
message:'کد ارسال شد'
})

}catch(err){

if (
    err.name==='TokenExpiredError'||
    err.name==='JsonWebTokenError'
) {
    res.clearCookie('temptoken',{
        httpOnly:true
    })

    return res.status(401).json({
        success:false,
        message:'مدت ثبت نام به پایان رسیده است'
    })
}

return res.status(401).json({
success:false,
message:err.message
})
}
}