const mongo=require('mongoose')

const schema=new mongo.Schema({
course:{
type:mongo.Schema.Types.ObjectId,
ref:'course'
},

title:{
type:String,
required:true
},

order:{//موقع کریت کلس بیاد کلس کانت کورس رو در بیاره و یکی بهش اضافه کنه و اینجا ذخیره کنه 
type:Number,
required:true
},

start_time:{
type:Date,
required:true
},

end_time:{
type:Date,
required:true
},

skyroomid:{
type:String,
required:true
},

joinlink:{
type:String,
required:true
},

recordurl:{
type:String,
required:true
},

status:{
type:Boolean,
default:false
}
})

module.exports=mongo.model('class',schema)