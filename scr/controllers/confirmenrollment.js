const fs = require('fs')
const path = require('path')
const transactionmodel = require('./../models/transaction')
const applyreceip = require('./../integrations/sms/applyreceipt')

module.exports = async (req, res) => {
    try {
        const enrollmentid=req.params.enrollmentid
        const receipt=await transactionmodel.findById(enrollmentid)
            .populate('user','name phone')
            .populate('course','title')
        if (!receipt){
            return res.status(404).json({
                success: false,
                message: 'رسید پیدا نشد'
            })
        }

        if (!receipt.user||!receipt.course) {
            return res.status(404).json({
                success:false,
                message:'کاربر یا دوره پیدا نشد'
            })
        }

        if (receipt.status!=='pending') {
            return res.status(409).json({
                success:false,
                message:'این رسید قبلا بررسی شده است'
            })
        }
        receipt.status='approved'
        await receipt.save()

        await applyreceip(
            receipt.user.name,
            receipt.user.phone,
            receipt.course.title
        )

            if (receipt.image) {
            const filePath = path.join(
                __dirname,
                '../public/receips',
                receipt.image
            )

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return res.status(200).json({
            success:true,
            message:'رسید با موفقیت تایید شد'
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}


// const enrollmentmodel=require('./../models/enrollment')
// const applyreceip=require('./../integrations/sms/applyreceipt')
//const spotplayer=require('./../integrations/spotplayer/spot')

// module.exports=async(req,res)=>{
// try{

// const enrollmentid=req.params.enrollmentid

// const enrollment=await enrollmentmodel.findById(enrollmentid)
// .populate('user','name phone')
// .populate('course','spotplayercourseid')

// if(enrollment){

// if (!enrollment.user||!enrollment.course) {
//     return res.status(404).json({
//         success: false,
//         message: 'کاربر یا دوره پیدا نشد'
//     })
// }

// if(enrollment.status==='success'&&enrollment.plicencs){
// return res.status(409).json({
// success:false,
// message:'کاربر قبلا  ثبت نام شده است'
// })
// }

// if(enrollment.status==='pending'&&enrollment.plicencs){
//     enrollment.status='success'
//     await enrollment.save()

//     return res.status(200).json({
// success:true,
// message:'ثبت نام دوره موفقیت آمیز بود'
// })

// }

// let license=await spotplayer(
// enrollment.user.name,
// enrollment.course.spotplayercourseid,
// enrollment.user.phone
// )

// if(license&&license.key){

// enrollment.plicencs=license.key
// enrollment.status='success'

// await enrollment.save()

// return res.status(200).json({
// success:true,
// message:'ثبت نام دوره موفقیت آمیز بود'
// })

// }else{

// return res.status(502).json({
// success:false,
// message:'مشکل اسپات پلیر'
// })

// }

// }

// return res.status(404).json({
// success:false,
// message:'ثبت نام ناقصی پیدا نشد'
// })

// }catch(err){

// return res.status(500).json({
// success:false,
// message:'server error'
// })

// }
// }