module.exports=async(req,res)=>{
res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
})

return res.status(201).json({
    success:true,
    message:'خارج شدید'
})
}