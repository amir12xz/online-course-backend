const mongoose=require('mongoose')

const receiptSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    image:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            'pending',
            'approved',
            'rejected'
        ],
        default:'pending'
    },
        amount:{
        type: Number,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model(
    'receipt',
    receiptSchema
)