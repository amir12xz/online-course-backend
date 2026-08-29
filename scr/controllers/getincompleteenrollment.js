const transactionmodel = require('./../models/transaction')
const enrollmentmodel = require('./../models/enrollment')

module.exports = async (req, res) => {

    try {

        const transactions = await transactionmodel.find({
            status: 'success'
        })
        .populate({
            path: 'user',
            select: '-password'
        })
        .populate({
            path: 'course',
            select: 'title price'
        })
        .sort({
            createdAt: -1
        })
        .lean()

        const result = []

        for (const transaction of transactions) {

            if (!transaction.user || !transaction.course) {
                continue
            }

            const enrollment = await enrollmentmodel.findOne({
                user: transaction.user._id,
                course: transaction.course._id,
                status: 'pending'
            }).lean()

            if (enrollment) {
                result.push({
                    transaction,
                    enrollment
                })
            }
        }

        const count = result.length

        return res.status(200).json({
            success: true,
            count,
            users: result
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}