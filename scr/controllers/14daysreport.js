const transactionmodel=require('./../models/transaction')

module.exports=async(req,res)=>{
    try{
        const now=new Date()

        const tehranDate=new Intl.DateTimeFormat('en-CA',{
            timeZone:'Asia/Tehran',
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        }).format(now)

        const [year,month,day] = tehranDate.split('-').map(Number)

        
        const todayTehran=new Date(
            `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}T00:00:00+03:30`
        )

        const startdate=new Date(todayTehran)
        startdate.setDate(startdate.getDate()-13)

        const enddate=new Date(todayTehran)
        enddate.setDate(enddate.getDate()+1)

        const sales=await transactionmodel.aggregate([
            {
                $match:{
                    status:'success',
                    createdAt:{
                        $gte:startdate,
                        $lt:enddate
                    }
                }
            },
            {
                $group:{
                    _id:{
                        $dateToString:{
                            format:'%Y-%m-%d',
                            date:'$createdAt',
                            timezone:'Asia/Tehran'
                        }
                    },
                    sales:{
                        $sum:1
                    },
                    amount:{
                        $sum:'$amount'
                    }
                }
            },
            {
                $sort:{
                    _id:1
                }
            }
        ])

        const result=[]

        for (let i=0;i<14;i++){

            const date=new Date(startdate)
            date.setDate(date.getDate()+i)

            const datestring=new Intl.DateTimeFormat('en-CA',{
                timeZone:'Asia/Tehran'
            }).format(date)

            const found=sales.find(item =>item._id===datestring)

            result.push({
                date: datestring,
                sales:found?found.sales:0,
                amount:found?found.amount:0
            })
        }

        return res.status(200).json({
            success:true,
            data:result
        })

    } catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}