const usermodel=require('./../models/user')

module.exports=async(req,res)=>{
try{

const page=Math.max(Number(req.query.page)||1,1)
const key=req.query.key?.trim()||''
const limit=100
const skip=(page-1)*limit

const filter={
verified:true,
deleted:false
}

if(key){
filter.$or=[
{name:{$regex:key,$options:'i'}},
{lastname:{$regex:key,$options:'i'}},
{phone:{$regex:key}}
]
}

const [users,count]=await Promise.all([
usermodel
.find(filter)
.select('-password')
.populate({
path:'enrollments',
match:{
status:'success'
},
populate:{
path:'course'
}
})
.skip(skip)
.limit(limit),
usermodel.countDocuments(filter)
])

return res.status(200).json({
success:true,
count,
users
})

}catch(err){
return res.status(500).json({
success:false,
message:'مشکل سرور'
})
}
}