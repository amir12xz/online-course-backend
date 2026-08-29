const mongo=require('mongoose')

const schema=new mongo.Schema({

title:{
type:String,
required:true
},

shortdescription:{
type:String,
required:true
},

longdescription:{
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
},
sessionscount:{
type:Number,
required:true
},

duration:{
type:String,
required:true
},

status:{
type:String
},

tags:{
type:String,
default:null
},
introvideo:{
type:String,
default:null
}
})

module.exports=mongo.model('course',schema)