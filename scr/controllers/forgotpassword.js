const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require('./../models/user')
const otpmodel=require('./../models/otp')
const codemaker=require('./../utils/createotpcode')
const sms=require('./../integrations/sms/farazsms')

module.exports.enterphone = async (req, res) => {
    try{

        const phone=req.body.phone
        const user=await usermodel.findOne({
            phone,
            verified:true
        })
        if(!user){
            return res.status(401).json({
                success:false,
                message: "If the phone exists, an OTP has been sent."
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

        res.cookie("temptoken",temptoken, {
            httpOnly:true
        })

        return res.status(201).json({
            success:true,
            message:"otp code send"
        })

    } catch (err){

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


module.exports.checkotp = async (req, res) => {
    try {

        const code =req.body.code
        const token =req.cookies.temptoken
        const data =jwt.verify(token, process.env.JWT)

        const otpcheck=await otpmodel.findOne({
            phone:data.phone,
            code,
            used:false
        })

        if (!otpcheck) {
            return res.status(401).json({
                success:false,
                message:"wrong code"
            })
        }

        otpcheck.used=true
        await otpcheck.save()

        const verifiedtoken=jwt.sign(
            {
                phone:data.phone,
                otpverified:true
            },
            process.env.JWT,
            {
                expiresIn:"5m"
            }
        )

        res.cookie("temptoken",verifiedtoken, {
            httpOnly: true
        })

        return res.status(200).json({
            success:true,
            message:"otp verified"
        })

    } catch (err) {

        return res.status(401).json({
            success:false,
            message:"invalid or expired token"
        })

    }
}

module.exports.resetpass = async (req, res) => {
    try {
        const newpassword=req.body.password
        const token=req.cookies.temptoken
        const data=jwt.verify(token, process.env.JWT)

        if (!data.otpverified) {
            return res.status(401).json({
                success:false,
                message:"otp verification required"
            })
        }

        const hashedpass=await bcrypt.hash(newpassword, 10)

        const user = await usermodel.findOne({
            phone: data.phone,
            verified: true
        })

        if(!user){
        return res.status(404).json({
        success:false,
        message:"user not found"
 })
}

        user.password=hashedpass

        await user.save()

        res.clearCookie("temptoken")

        const accessToken = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT,
            {
                expiresIn:"5d"
            }
        )

        res.cookie("token",accessToken, {
            httpOnly: true,
            secure: false,
            sameSite:"lax"
        })

        return res.status(200).json({
            success:true,
            message:"able to login"
        })

    } catch (err) {

        return res.status(401).json({
            success:false,
            message:"invalid or expired token"
        })

    }
}