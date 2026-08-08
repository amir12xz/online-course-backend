const jwt=require('jsonwebtoken')
const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
try{
const {name,lastname}=req.body
const token=req.cookies.token
const decode=jwt.verify(token,process.env.JWT)
const user=await usermodel
.findById(decode.id)
.select('-password')

if(!user)
return res.status(401).json({
    success:false,
    message:'user not found'
})

if(name)
    user.name=name

if(lastname)
    user.lastname=lastname

await user.save()

return res.status(200).json({
    success:true,
    message:'profile updated',
    user
})

}catch(err){

return res.status(401).json({
    success:false,
    message:err.message
})
}
}