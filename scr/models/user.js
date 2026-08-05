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
type:Number,   
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
}

  },
  {
timestamps:true  
  }
);

module.exports =mongo.model('user',schema);



/*const mongo=require('mongoose')

const schema=new mongo.Schema({

})

module.exports=mongo.model('',schema)*/