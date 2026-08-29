const transactionmodel = require('./../models/transaction')

module.exports = async (req, res) => {
    try {

        const now = new Date()

        const starttoday = new Date(now)
        starttoday.setHours(0, 0, 0, 0)

        const start7days = new Date(now)
        start7days.setDate(start7days.getDate() - 7)

        const start30days = new Date(now)
        start30days.setDate(start30days.getDate() - 30)

        const startyear = new Date(now)
        startyear.setDate(startyear.getDate() - 365)

        const filter = {
            status: 'success'
        }

        const [
            today,
            last7days,
            last30days,
            lastyear,
            total
        ] = await Promise.all([

            transactionmodel.aggregate([
                {
                    $match: {
                        ...filter,
                        createdAt: { $gte: starttoday }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amount: { $sum: '$amount' }
                    }
                }
            ]),

            transactionmodel.aggregate([
                {
                    $match: {
                        ...filter,
                        createdAt: { $gte: start7days }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amount: { $sum: '$amount' }
                    }
                }
            ]),

            transactionmodel.aggregate([
                {
                    $match: {
                        ...filter,
                        createdAt: { $gte: start30days }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amount: { $sum: '$amount' }
                    }
                }
            ]),

            transactionmodel.aggregate([
                {
                    $match: {
                        ...filter,
                        createdAt: { $gte: startyear }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amount: { $sum: '$amount' }
                    }
                }
            ]),

            transactionmodel.aggregate([
                {
                    $match: filter
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amount: { $sum: '$amount' }
                    }
                }
            ])
        ])

        return res.status(200).json({
            success: true,

            data: {
                today: today[0] || { count: 0, amount: 0 },
                last7days: last7days[0] || { count: 0, amount: 0 },
                last30days: last30days[0] || { count: 0, amount: 0 },
                lastyear: lastyear[0] || { count: 0, amount: 0 },
                total: total[0] || { count: 0, amount: 0 }
            }
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        })

    }
}