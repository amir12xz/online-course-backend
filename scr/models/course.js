const mongo=require('mongoose')

const schema=new mongo.Schema({

title:{
type:String,
required:true
},

description:{
type:String,
required:true
},

thumbnail:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

status:{
type:Boolean,
default:false
}
})

module.exports=mongo.model('course',schema)