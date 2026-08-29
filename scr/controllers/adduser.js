const usermodel=require('./../models/user')
const bcrypt=require('bcrypt')
const sms=require('./../integrations/sms/passwordsms')

module.exports=async(req,res)=>{
try{
const {name,lastname,phone,password}=req.body
const userid=req.params.userid

if(userid){
const updatedata={name,lastname,phone}

const user=await usermodel.findByIdAndUpdate(
userid,
updatedata,
{new:true}
)

if(!user){
return res.status(404).json({
success:false,
message:'کاربر پیدا نشد'
})
}

if(password){
user.password=await bcrypt.hash(password,10)
await user.save()
await sms(password,user.phone)
}



return res.status(200).json({
success:true,
message:'کاربر ویرایش شد',
user
})

}else{
const userr = await usermodel.findOne({phone})

if (userr) {
    return res.status(409).json({
        success:false,
        message:'این شماره موبایل قبلاً ثبت شده است'
    })
}
const hashedpassword=await bcrypt.hash(password,10)

const user=await usermodel.create({
name,
lastname,
phone,
password:hashedpassword,
verified:true
})
await sms(password,user.phone)
return res.status(201).json({
success:true,
message:'کاربر اضافه شد',
user
})
}

}catch(err){
    console.log(err)
return res.status(500).json({
success:false,
message:'server error'
})
}
}