const mongoose=require('mongoose')


const transactionSchema=new mongoose.Schema({

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

    amount:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:[
            'pending',
            'success',
            'failed'
        ],
        default:'pending'
    },

    authority:{//ایدی پرداخت 
        type:String,
        unique:true,
        sparse:true
    },

    refId:{
        type:String
    }

},{
    timestamps:true
})


module.exports=mongoose.model(
'transaction',
transactionSchema
)