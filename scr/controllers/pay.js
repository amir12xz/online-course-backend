const jwt=require('jsonwebtoken')
const axios=require('axios')
const usermodel=require('./../models/user')
const coursemodel=require('./../models/course')
const enrollmentmodel=require('./../models/enrollment')
const transactionmodel=require('./../models/transaction')

module.exports=async(req,res)=>{
try{
    const token=req.cookies.token
    const {Redirect}=req.query
    const courseid=req.params.courseid
    const decode=jwt.verify(token,process.env.JWT)

    const user = await usermodel.findOne({
    _id: decode.id,
    verified: true,
    deleted: false
})

    if(!user)
        return res.status(404).json({
        success:false,
        message:'کاربر پیدا نشد'
        })

    const course=await coursemodel.findById(courseid)

        if(!course)
        return res.status(404).json({
        success:false,
        message:'دوره پیدا نشد'
        })

        if(!course.spotplayercourseid)
        return res.status(404).json({
        success:false,
        message:'مشکلی در بارگداری دوره بوجود آمد'
        })

const enrollment = await enrollmentmodel.findOne({
    user: user._id,
    course: course._id
})

if (enrollment) {

    if (enrollment.status === 'success'||enrollment.plicencs) {
        return res.status(409).json({
            success: false,
            message: 'شما قبلا ثبت نام کرده اید'
        })
    }

    if (enrollment.status === 'pending') {
        return res.status(409).json({
            success: false,
            message: 'ثبت نام شما ناقص است لطفا به پشتیبانی اطلاع دهید'
        })
    }
}
const pendingTransaction = await transactionmodel.findOne({
    user:user._id,
    course:course._id,
    status:{$in:['pending'] },
    createdAt:{ $gte:new Date(Date.now()-30*60*1000)}
})

if (pendingTransaction) {
    return res.status(409).json({
        success: false,
        message:'برای پرداخت بعدی باید 30 دقیقه صبر کنید'
    })
}
if (!course.price||course.price<=0){
  return res.status(400).json({
    success:false,
    message:'قیمت دوره نامعتبر است'
  })
}

    const transaction=await transactionmodel.create({
    user:user._id,
    course:course._id,
    amount:course.price
    })


    const orderdata={
    merchant_id:process.env.ZARINPALID,
    amount:course.price*10,
    description:`buy ${course.title}`,
    callback_url:`${process.env.ZARINPALCALLBACK}?Redirect=${encodeURIComponent(Redirect)}`
}

const respone=await axios.post(
    'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
    orderdata  
)

const data=respone.data.data

if (data.code !== 100){
    transaction.status='failed'
    await transaction.save()

    return res.status(400).json({
        success:false,
        message:'ارتباط با درگاه پرداخت زرین پال ناموفق بود لطفا بعدا امتحان کنید'
    })
}

transaction.authority=data.authority
await transaction.save()

return res.status(200).json({
success:true,
url:`https://sandbox.zarinpal.com/pg/StartPay/${data.authority}`
}
)

}catch(err){
  console.error('Payment initiation error:', err)


  if (err.name==='JsonWebTokenError'||err.name==='TokenExpiredError'){
    res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
})

    return res.status(401).json({
      success:false,
      message:'توکن نامعتبر'
    })
  }
  return res.status(500).json({
    success:false,
    message:'خطا در شروع پرداخت'
  })
}
}