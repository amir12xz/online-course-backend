const loginhistorymodel = require('./../models/loginhistory')

module.exports = async (req, res) => {
    try {

        const now=new Date()

        const starttoday=new Date(now)
        starttoday.setHours(0, 0, 0, 0)

        const start7day=new Date(now)
        start7day.setDate(start7day.getDate()-7)

        const start30day= new Date(now)
        start30day.setDate(start30day.getDate()-30)

        const startyear=new Date(now)
        startyear.setDate(startyear.getDate()-365)


        const [
            today,
            last7Days,
            last30Days,
            lastYear,
            total
        ] = await Promise.all([

            loginhistorymodel.countDocuments({
                createdAt:{ $gte:starttoday}
            }),

            loginhistorymodel.countDocuments({
                createdAt:{$gte:start7day}
            }),

            loginhistorymodel.countDocuments({
                createdAt:{$gte:start30day}
            }),

            loginhistorymodel.countDocuments({
                createdAt:{$gte:startyear}
            }),

            loginhistorymodel.countDocuments()
        ])

        return res.status(200).json({
            success: true,
            data: {
                today,
                last7Days,
                last30Days,
                lastYear,
                total
            }
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        })

    }
}