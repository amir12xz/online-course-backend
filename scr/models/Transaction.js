const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            'pending',
            'success',
            'failed',
            'expired'
        ],
        default: 'pending'
    },

    authority: {
        type: String,
        unique: true,
        sparse: true
    },

    refId: {
        type: String
    }

}, {
    timestamps: true
})

transactionSchema.index(
    { user: 1, course: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: 'pending'
        }
    }
)

module.exports = mongoose.model(
    'transaction',
    transactionSchema
)