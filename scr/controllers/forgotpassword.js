const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const codemaker=require('./../utils/createotpcode')
const sms=require('./../integrations/sms/forgotpassword')

module.exports.enterphone = async (req, res) => {
    try{
        const token=req.cookies.temptokenf

if (token) {
    try {
        const payload=jwt.verify(token,process.env.JWT);

        if (payload?.phone && payload?.otpVerified===false){
            return res.status(409).json({
                success:false,
                message:'یک فرآیند بازیابی رمز عبور در حال انجام است'
            })
        }

    }catch(err){
        res.clearCookie('temptokenf')
    }
}

        const phone=req.body.phone
        const user=await usermodel.findOne({
            phone,
            verified:true,
            deleted:false
        })
        if(!user){
            return res.status(200).json({
                success:false,
                message:'شماره وجود  ندارد ثبت نام کنید '
            })
        }


        const otpcode=codemaker()

        await otpmodel.deleteMany({
    phone,
    used:false
})

        await otpmodel.create({
            phone,
            code:otpcode,
            expiredAt: new Date(Date.now() + 60 * 1000)
        })

        // await sms(otpcode, user.phone)

        const temptoken=jwt.sign(
            {
                phone:user.phone,
                otpVerified:false
            },
            process.env.JWT,
            {
                expiresIn:"5m"
            }
        )

        res.cookie("temptokenf",temptoken, {
            httpOnly:true
        })

        return res.status(200).json({
            success:true,
            message:"کد ارسال شد"
        })

    } catch (err){
                if (err.code==='ECONNABORTED'){
        console.log('SMS Timeout:',err.message)
    }

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


module.exports.checkotp = async (req, res) => {
    try {

        const code =req.body.code
  const token = req.cookies.temptokenf;

if (!token){
        res.clearCookie('temptokenf',{
        httpOnly: true
        })
    return res.status(401).json({
        success:false,
        message:'مدت زمان بازیابی رمز عبور به پایان رسیده است'
    })
}

const data=jwt.verify(token, process.env.JWT)

        const otpcheck=await otpmodel.findOne({
            phone:data.phone,
            code,
            used:false
        })

        const user=await usermodel.findOne({phone:data.phone})

        if(!user)
                return res.status(404).json({
                success:false,
                message:"کاربر پیدا نشد"
            })

        if (!otpcheck) {
            return res.status(400).json({
                success:false,
                message:"کد اشتباه است"
            })
        }

        if(!otpcheck)
{
    return res.status(400).json({
    success:false,
    message:'کد نامعتبر یا منقضی شده است'
})
}


        if(otpcheck.expiredAt<new Date()){
        return res.status(400).json({
        success:false,
        message:"کد منقضی شده است"
    })
}

 


        otpcheck.used=true
        await otpcheck.save()

            res.clearCookie('temptokenf', {
                httpOnly: true
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
sameSite:'lax'
})

        return res.status(200).json({
            success:true,
            message:"مجاز به ورود"
        })

    } catch (err) {
    if (
            err.name === 'JsonWebTokenError' ||
            err.name === 'TokenExpiredError'
        ) {
            res.clearCookie('temptokenf', {
                httpOnly: true
            })


            return res.status(401).json({
                success: false,
                message:'مدت زمان عملیات به پایان رسیده دوباره امتحان کنید'
            })
        }

        console.log(err)

        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}

module.exports.otpagain = async (req, res) => {

    try {

       const token=req.cookies.temptokenf

if (!token){
         res.clearCookie('temptokenf',{
        httpOnly: true
            })
    return res.status(401).json({
        success:false,
        message:'مدت زمان بازیابی رمز عبور به پایان رسیده است'
    })
}
const payload=jwt.verify(token, process.env.JWT)

        const otp = await otpmodel.findOne({
            phone: payload.phone,
            used: false
        })

        if (otp && otp.expiredAt > new Date()) {
            return res.status(409).json({
                success: false,
                message: 'کد قبلی منقضی نشده است'
            })
        }

        await otpmodel.deleteMany({
            phone: payload.phone,
            used: false
        })

        const otpcode = codemaker()

        await otpmodel.create({
            phone: payload.phone,
            code: otpcode,
            expiredAt: new Date(Date.now() + 60 * 1000)
        })

        // await sms(otpcode, payload.phone)

        return res.status(200).json({
            success:true,
            message:'کد ارسال شد'
        })

    } catch (err) {

      if (
    err.name==='TokenExpiredError'||
    err.name==='JsonWebTokenError'
) {
    res.clearCookie('temptokenf',{
        httpOnly:true
    })

    return res.status(401).json({
        success:false,
        message:'مدت زمان بازیابی رمز عبور به پایان رسیده است'
    })
}
        if (err.code==='ECONNABORTED'){
        console.log('SMS Timeout:',err.message)
    }

        return res.status(401).json({
            success:false,
            message:err.message
        })
    }
}