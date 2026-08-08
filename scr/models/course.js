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
spotplayercourseid:{
type:String,
default:null
}
})

module.exports=mongo.model('course',schema)