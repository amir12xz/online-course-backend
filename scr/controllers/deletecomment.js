const commentmodel=require('./../models/comment')

module.exports=async(req,res)=>{
try{
    const commentid=req.params.id
    const comment=await commentmodel.findByIdAndDelete(commentid)

    if(comment)
        return res.status(200).json({
    success:true,
message:'کامنت پاک شد'})

return res.status(404).json({
    success:false,
    message:'کامنت پیدا نشد'
})
}catch(err){
return res.status(500).json({
success:false,
message:'server error'
})
}
}