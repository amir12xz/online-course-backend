const path=require('path')
const fs=require('fs')
const transactionmodel=require('./../models/transaction')
const rejectsmsm=require('./../integrations/sms/rejectedreceip')

module.exports=async(req,res)=>{
    try{
        const enrollmentid=req.params.enrollmentid
        const receipt = await transactionmodel.findById(enrollmentid)
        if (!receipt){
            return res.status(404).json({
                success:false,
                message:'رسید پیدا نشد'
            })
        }

        if (receipt.status!=='pending') {
            return res.status(409).json({
                success:false,
                message:'این رسید قبلا بررسی شده است'
            })
        }

        receipt.status='rejected'
        await receipt.save()
             await rejectsmsm(
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
                        fs.unlinkSync(filePath)
                    }
                }

        return res.status(200).json({
            success:true,
            message:'رسید با موفقیت رد شد'
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}