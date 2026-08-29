const commentmodel=require('./../models/comment')

module.exports=async(req,res)=>{
try{
        const commentid=req.params.id
    const replytext=req.body.reply
    const comment=await commentmodel.findById(commentid)
    if(comment)
    {
        if (typeof replytext !== 'string' || !replytext.trim()) {
    return res.status(400).json({
        success:false,
        message:'متن پاسخ معتبر نیست'
    })
}

        comment.reply=replytext
        await comment.save()

        return res.status(200).json({
            success:true,
            message:'پاسخ شما  ارسال شد'
        })
    }

    return res.status(404).json({
        success:false,
        message:'کامنتی یافت نشد'
    })
}catch(err){
    return res.status(500).json({
success:false,
message:'مشکل سرور'
})
}
}