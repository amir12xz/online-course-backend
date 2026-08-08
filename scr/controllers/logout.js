module.exports=async(req,res)=>{
res.clearCookie('token')

return res.status(201).json({
    success:true,
    message:'loged out'
})
}