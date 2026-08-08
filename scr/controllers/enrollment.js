const mongoose=require('mongoose')
const axios=require('axios')
const transactionmodel=require('./../models/transaction')
const coursemodel=require('./../models/course')
const enrollmentmodel=require('./../models/enrollment')
const usermodel=require('./../models/user')
const spotplayer=require('./../integrations/spotplayer/spot')

module.exports=async(req,res)=>{
try{

const {Authority,Status}=req.query

const transaction=await transactionmodel.findOne({
authority:Authority
})

if(!transaction)
return res.status(404).json({
success:false,
message:'transaction not found'
})

if(Status!=='OK'){

if(transaction.status!=='success'){
transaction.status='failed'
await transaction.save()
}

return res.status(400).json({
success:false,
message:'payment failed'
})

}

const user=await usermodel.findById(transaction.user).select('-password')

if(!user)
return res.status(400).json({
success:false,
message:'user not found'
})

const course=await coursemodel.findById(transaction.course)

if(!course)
return res.status(404).json({
success:false,
message:'course not found'
})

if(transaction.status!=='success'){

const response=await axios.post(
'https://payment.zarinpal.com/pg/v4/payment/verify.json',
{
merchant_id:process.env.ZARINPALID,
amount:transaction.amount,
authority:Authority
}
)

const data=response.data.data

if(data.code===100){

transaction.status='success'
transaction.refId=String(data.ref_id)

await transaction.save()

}else if(data.code===101){

transaction.status='success'

if(data.ref_id)
transaction.refId=String(data.ref_id)

await transaction.save()

}else{

transaction.status='failed'

await transaction.save()

return res.status(400).json({
success:false,
message:'payment verification failed',
code:data.code
})

}

}

const enrollment=await enrollmentmodel.findOne({
user:transaction.user,
course:transaction.course
})

if(enrollment && enrollment.status==='success'){

return res.json({
success:true,
message:'payment and enrollment already completed'
})

}

let license

try{

license=await spotplayer(
user.name,
course.spotplayercourseid,
user.phone
)

if(!license || !license.key){

throw new Error('spotplayer license was not created')

}

}catch(err){

console.log('SpotPlayer Error:',err)

if(enrollment){

enrollment.status='pending'
await enrollment.save()

}else{

await enrollmentmodel.create({
user:transaction.user,
course:transaction.course,
status:'pending',
plicencs:null
})

}

return res.status(500).json({
success:false,
message:'payment successful but enrollment is incomplete'
})

}

const session=await mongoose.startSession()

try{

await session.withTransaction(async()=>{

if(enrollment){

enrollment.status='success'
enrollment.plicencs=license.key

await enrollment.save({session})

}else{

await enrollmentmodel.create([{
user:transaction.user,
course:transaction.course,
status:'success',
plicencs:license.key
}],{session})

}

})

}finally{

await session.endSession()

}

return res.json({
success:true,
message:'payment and enrollment successful'
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}