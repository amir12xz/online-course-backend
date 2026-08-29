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

text:{
    type:String,
    required:true
},

reply:{
type:String,
default:null
}
},{
timestamps:true
})

module.exports=mongo.model('comment',schema)