const jwt = require('jsonwebtoken')
const usermodel = require('./../models/user')

module.exports = async(req,res)=>{

try{
const token=req.cookies.token

if(!token)
return res.status(401).json({
    success:false,
    message:'not authenticated'
})

const decode=jwt.verify(token,process.env.JWT)

const user=await usermodel.findOneAndUpdate(
{
    _id:decode.id,
    verified:true
},
{
    $unset:{
        name:"",
        lastname:"",
        phone:"",
        password:"",
        verified:""
    },
    $set:{
        deleted:true
    }
}
)

if(!user)
return res.status(404).json({
    success:false,
    message:'user not found'
})
res.clearCookie('token')

return res.status(200).json({
    success:true,
    message:'user deleted'
})

}catch(err){

return res.status(401).json({
    success:false,
    message:'invalid token'
})

}
}