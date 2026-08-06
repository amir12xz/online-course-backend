const mongo=require('mongoose')

const schema=new mongo.Schema({
user:{
type:mongo.Schema.Types.ObjectId,
ref:'user'
},

course:{
type:mongo.Schema.Types.ObjectId,
ref:'course'
}
},{
timestamps:true
})

schema.index(
    {
        user:1,
        course:1
    },
    {
        unique:true
    }
)

module.exports=mongo.model('enrollment',schema)