const loginhistorymodel=require('./../models/loginhistory')

module.exports=async(req,res)=>{
    try{
        const now=new Date()

        const tehranDate=new Intl.DateTimeFormat('en-CA',{
            timeZone:'Asia/Tehran',
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        }).format(now)

        const [year,month,day]=tehranDate.split('-').map(Number)

        const starttoday=new Date(
            `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}T00:00:00+03:30`
        )

        const start7day=new Date(starttoday)
        start7day.setDate(start7day.getDate()-7)

        const start30day=new Date(starttoday)
        start30day.setDate(start30day.getDate()-30)

        const startyear=new Date(starttoday)
        startyear.setDate(startyear.getDate()-365)

        const [
            today,
            last7Days,
            last30Days,
            lastYear,
            total
        ]=await Promise.all([
            loginhistorymodel.countDocuments({
                createdAt:{$gte:starttoday}
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
            success:true,
            data:{
                today,
                last7Days,
                last30Days,
                lastYear,
                total
            }
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}