
const axios = require('axios')
const transactionmodel = require('./../models/transaction')

module.exports = async (req, res) => {

    try {

        // =========================================
        // دریافت هر چیزی که زرین پال در callback فرستاده
        // =========================================

        console.log('ZARINPAL CALLBACK QUERY:', req.query)

        const {
            Authority,
            Status,
            Redirect
        } = req.query


        // =========================================
        // بررسی اطلاعات اولیه
        // =========================================

        if (!Authority || !Status) {

            return res.status(400).json({
                success: false,
                message: 'اطلاعات callback ناقص است',
                data: req.query
            })

        }


        // =========================================
        // پیدا کردن تراکنش خودمان
        // =========================================

        const transaction = await transactionmodel.findOne({
            authority: Authority
        })

        if (!transaction) {

            return res.status(404).json({
                success: false,
                message: 'تراکنش پیدا نشد',
                authority: Authority,
                status: Status
            })

        }


        // =========================================
        // اگر پرداخت توسط کاربر لغو شده باشد
        // =========================================

        if (Status !== 'OK') {

    return res.redirect(
        `${Redirect}?status=${encodeURIComponent(Status)}&authority=${encodeURIComponent(Authority)}`
    )

        }


        // =========================================
        // Verify پرداخت در زرین پال
        // =========================================

        const response = await axios.post(
            'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
            {
                merchant_id:process.env.ZARINPALID,
                amount:transaction.amount*10,
                authority:Authority
            }
        )


        console.log('ZARINPAL VERIFY RESPONSE:', response.data)


        const data = response.data.data


        // =========================================
        // پرداخت موفق
        // =========================================

        if (data.code === 100 || data.code === 101) {

            const refId = data.ref_id
                ? String(data.ref_id)
                : ''


            // ذخیره وضعیت پرداخت
            transaction.status = 'success'

            if (refId) {
                transaction.refId = refId
            }

            await transaction.save()


            // =========================================
            // اطلاعاتی که می‌خواهیم به فرانت بدهیم
            // =========================================

            const price = transaction.amount

            const paymentTime = new Date().toISOString()


            // =========================================
            // Redirect به صفحه موفقیت
            // =========================================

    return res.redirect(
        `${Redirect}?price=${encodeURIComponent(price)}&refId=${encodeURIComponent(refId)}&time=${encodeURIComponent(paymentTime)}&authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}`
    )

        }


        // =========================================
        // Verify ناموفق
        // =========================================

        transaction.status = 'failed'

        await transaction.save()


return res.redirect(
    `${Redirect}?authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}&code=${encodeURIComponent(data.code)}`
)


    } catch (err) {

        console.log('ZARINPAL CALLBACK ERROR:', err)

        return res.status(500).json({
            success: false,
            message: 'خطا در پردازش پرداخت'
        })

    }

}





/*const mongoose=require('mongoose')
const axios=require('axios')
const transactionmodel=require('./../models/transaction')
const coursemodel=require('./../models/course')
const enrollmentmodel=require('./../models/enrollment')
const usermodel=require('./../models/user')
const spotplayer=require('./../integrations/spotplayer/spot')

module.exports=async(req,res)=>{
try{

const {Authority,Status,Redirect}=req.query

if (!Authority || !Status||!Redirect) {
    return res.status(400).json({
        success:false,
        message:'اطلاعات پرداخت ناقص است'
    })
}

const transaction=await transactionmodel.findOne({
authority:Authority
})

if(!transaction)
return res.status(404).json({
success:false,
message:'پرداخت پیدا نشد'
})

if(Status!=='OK'){

if(transaction.status!=='success'){
transaction.status='failed'
await transaction.save()
}

    return res.redirect(
        `${Redirect}?authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}&isincomplete=false&message=${encodeURIComponent('پرداخت لغو شد و ثبت نام انجام نشد')}`
    )

}

const user=await usermodel.findById(transaction.user).select('-password')

if(!user)
return res.status(404).json({
success:false,
message:'کاربر پیدا نشد '
})

const course=await coursemodel.findById(transaction.course)

if(!course)
return res.status(404).json({
success:false,
message:'دوره پیدا نشد'
})

let refId = ''
let paymentTime = ''

if (transaction.status!=='success'){
    const response = await axios.post(
        'https://payment.zarinpal.com/pg/v4/payment/verify.json',
        {
            merchant_id:process.env.ZARINPALID,
            amount:transaction.amount*10,
            authority:Authority
        }
    )
    const data=response.data.data
    refId = data.ref_id ? String(data.ref_id) : ''
    paymentTime = new Date().toISOString()
    if (data.code===100||data.code===101){
        const updated=await transactionmodel.findOneAndUpdate(
            { 
                _id:transaction._id, 
                status:{$ne:'success' }   
            },
            { 
                $set:{ 
                    status:'success',
                    refId:data.ref_id?String(data.ref_id):undefined
                } 
            },
            {new:true}
        )

        if (!updated) {
            return res.json({
                success:true,
                message:'پرداخت و ثبت نام قبلا صورت گرفته است'
            })
        }

    }else{

        await transactionmodel.findOneAndUpdate(
            { _id:transaction._id,status:{$ne:'success'}},
            { $set:{ status:'failed'}}
        )

return res.redirect(
    `${Redirect}?authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}&code=${encodeURIComponent(data.code)}&isincomplete=false&message=${encodeURIComponent('پرداخت تایید نشد و ثبت نام انجام نشد')}`
)
    }
}

const enrollment=await enrollmentmodel.findOne({
user:transaction.user,
course:transaction.course
})

if (enrollment&&(enrollment.status==='success'||enrollment.plicencs)){
return res.json({
success:true,
message:'پرداخت و ثبت نام قبلا صورت گرفته است'
})

}

let license

try{

license=await spotplayer(
user.name,
course.spotplayercourseid,
user.phone
)

if(!license||!license.key){

throw new Error('spotplayer license was not created')

}

}catch(err){

console.log('SpotPlayer Error:',err)

if(enrollment){

enrollment.status='pending'
await enrollment.save()

}else{

await enrollmentmodel.create({
user:transaction.user,
course:transaction.course,
status:'pending',
plicencs:null
})

}

return res.redirect(
    `${Redirect}?price=${encodeURIComponent(transaction.amount)}&authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}&isincomplete=true&message=${encodeURIComponent('پرداخت موفقیت آمیز بود اما ثبت نام صورت نگرفت لطفا به پشتیبانی اطلاع دهید')}`
)

}

const session=await mongoose.startSession()

try{

await session.withTransaction(async()=>{

if(enrollment){

enrollment.status='success'
enrollment.plicencs=license.key

await enrollment.save({session})

}else{

await enrollmentmodel.create([{
user:transaction.user,
course:transaction.course,
status:'success',
plicencs:license.key
}],{session})

}

})

}finally{

await session.endSession()

}

return res.redirect(
    `${Redirect}?price=${encodeURIComponent(transaction.amount)}&refId=${encodeURIComponent(refId)}&time=${encodeURIComponent(paymentTime)}&authority=${encodeURIComponent(Authority)}&status=${encodeURIComponent(Status)}&license=${encodeURIComponent(license.key)}&isincomplete=false&message=${encodeURIComponent('پرداخت و ثبت نام با موفقیت انجام شد')}`
)

}catch(err){
if (err.code===11000) {
 return res.status(409).json({
        success: false,
        message: 'ثبت نام شما در حال انجام است'
    })
  }
console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})
}
}*/