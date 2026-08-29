const mongoose=require('mongoose')

const schema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
}, {
    timestamps:true
})

schema.index({createdAt:1})

module.exports=mongoose.model('loginhistory',schema)