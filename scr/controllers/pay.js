const jwt=require('jsonwebtoken')
const axios=require('axios')
const usermodel=require('./../models/user')
const coursemodel=require('./../models/course')
const enrollmentmodel=require('./../models/enrollment')
const transactionmodel=require('./../models/transaction')

module.exports=async(req,res)=>{
try{
    const token=req.cookies.token
    const courseid=req.params.courseid
    const decode=jwt.verify(token,process.env.JWT)

    const user=await usermodel.findById(decode.id)

    if(!user)
        return res.status(400).json({
        success:false,
        message:'user not found'
        })

    const course=await coursemodel.findById(courseid)

        if(!course)
        return res.status(400).json({
        success:false,
        message:'course not found'
        })

        const enrollment=await enrollmentmodel.findOne({
user:user._id,
course:course._id,
status:'success'
})

if(enrollment){
return res.status(400).json({
success:false,
message:'you already enrolled in this course'
})
}

    const transaction=await transactionmodel.create({
    user:user._id,
    course:course._id,
    amount:course.price
    })

    const orderdata={
    merchant_id:process.env.ZARINPALID,
    amount:course.price,
    description:`buy ${course.title}`,
    callback_url:process.env.ZARINPALCALLBACK
}

const respone=await axios.post(
    "https://payment.zarinpal.com/pg/v4/payment/request.json",
    orderdata  
)

const data=respone.data.data

if (data.code !== 100){
    transaction.status='failed'
    await transaction.save()

    return res.status(400).json({
        success:false,
        message:'payment request failed'
    })
}

transaction.authority=data.authority
await transaction.save()

return res.redirect(
    `https://payment.zarinpal.com/pg/StartPay/${data.authority}`
)

}catch(err){
return res.status(401).json({
      success:false,
      message:'invalid token'
    })
}
}