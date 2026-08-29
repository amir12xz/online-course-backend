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
},
deleted:{
  type:Boolean,
  default:false
}

  },
  {
timestamps:true  
  }
);

schema.virtual('enrollments', {
    ref: 'enrollment',
    localField: '_id',
    foreignField: 'user'
})

schema.set('toObject',{virtuals:true })
schema.set('toJSON',{virtuals:true })

module.exports =mongo.model('user',schema);



 