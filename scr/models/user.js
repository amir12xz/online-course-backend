const mongo = require('mongoose');

const schema = new mongo.Schema(
{
name:{
type:String,
required:true,
trim:true
},

lastname:{
type:String,
required:true,
trim:true
},

phone:{
type:String,   
required:true,
unique:true,
trim:true
},

isverified:{
type:Boolean,
default:false
},

avatar:{
type:String,
default:null
},

password:{
type:String,
required:true,
trim:true
},

role:{
type:String,
enum:['user','admin'],
default:'user'
},
verified:{
  type:Boolean,
  default:false
}

  },
  {
timestamps:true  
  }
);

module.exports =mongo.model('user',schema);



 