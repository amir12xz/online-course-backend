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

payment:{
type:Boolean,
default:false
},
},{
timestamps:true
})

module.exports=mongo.model('enrollment',schema)