const mongo=require('mongoose')

const schema=new mongo.Schema({
user:{
type:mongo.Schema.Types.ObjectId,
ref:'user'
},

course:{
type:mongo.Schema.Types.ObjectId,
ref:'course'
},

amount:{
type:mongo.Schema.Types.ObjectId,
ref:'course'
},

pay_id:{
type:String,
required:true,
trim:true
},

status:{
type:Boolean,
default:false
},
},
{
timestamps:true
})

module.exports=mongo.model('payment',schema)