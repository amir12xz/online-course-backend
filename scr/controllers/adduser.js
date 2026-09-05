const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')
const bcrypt=require('bcrypt')
const sms=require('./../integrations/sms/passwordsms')

module.exports=async(req,res)=>{
  try {
    const {name,lastname,phone,password,role}=req.body
    const userid=req.params.userid
    const token=req.cookies.token
    const decode=jwt.verify(token,process.env.JWT)

    if (userid){
      const existing=await usermodel.findOne({phone,_id:{$ne:userid}})
      if (existing) {
        return res.status(409).json({
          success:false,
          message:'این شماره موبایل قبلاً برای کاربر دیگری ثبت شده است'
        })
      }

      const checkroll=await usermodel.findById(userid)

      if(userid==decode.id&&checkroll?.role=='admin')
      return res.status(409).json({
      success:false,
      message:'نمی توان نقش این کاربر را تغییر داد'})

      const updatedata={ name,lastname,phone,role}
      const user=await usermodel.findByIdAndUpdate(userid,updatedata,{new:true})

      if (!user){
        return res.status(404).json({
          success:false,
          message:'کاربر پیدا نشد'
        })
      }

      if (password&&password.trim()){
        user.password=await bcrypt.hash(password,10)
        await user.save()
        // await sms(password, user.phone)
      }

      const safeUser=user.toObject()
      delete safeUser.password

      return res.status(200).json({
        success:true,
        message:'کاربر ویرایش شد',
        user:safeUser
      })

    } else{
      // ساخت کاربر جدید
      if (!password||!password.trim()) {
        return res.status(400).json({
          success:false,
          message:'رمز عبور الزامی است'
        })
      }

      const userr=await usermodel.findOne({phone})
      if (userr) {
        return res.status(409).json({
          success: false,
          message:'این شماره موبایل قبلاً ثبت شده است'
        })
      }

      const hashedpassword=await bcrypt.hash(password,10)

      const user=await usermodel.create({
        name,
        lastname,
        phone,
        password:hashedpassword,
        role,
        verified:true
      })

      // await sms(password, user.phone)

      const safeUser=user.toObject()
      delete safeUser.password

      return res.status(201).json({
        success:true,
        message:'کاربر اضافه شد',
        user:safeUser
      })
    }

  } catch(err){
    console.log(err)

    if (err.code===11000) {
      return res.status(409).json({
        success:false,
        message:'این شماره موبایل قبلاً ثبت شده است'
      })
    }

    return res.status(500).json({
      success:false,
      message:'server error'
    })
  }
}