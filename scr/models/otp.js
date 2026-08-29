const mongo=require('mongoose')

const schema=new mongo.Schema({

phone: {
    type:String,
    required:true,
    trim:true
},

code:{
type:Number,
required:true
},

expiredAt:{
type: Date,
required: true
},

used:{
type:Boolean,
default:false
}
})

schema.index({expiredAt:1},{expireAfterSeconds:0})

module.exports=mongo.model('otp',schema)