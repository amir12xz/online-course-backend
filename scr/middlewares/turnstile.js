// const axios=require('axios')

// module.exports=async(req, res, next)=>{
//   try{
//     const token=req.body['cf-turnstile-response'] || req.body.captchaToken

//     if(!token){
//       return res.status(400).json({
//         success:false,
//         message:'کپچا ارسال نشده است'
//       })
//     }

//     const { data } = await axios.post(
//       'https://challenges.cloudflare.com/turnstile/v0/siteverify',
//       new URLSearchParams({
//         secret: process.env.TURNSTILE_SECRET_KEY,
//         response: token
//       }),
//       {
//         headers:{
//           'Content-Type':'application/x-www-form-urlencoded'
//         }
//       }
//     )

//     if (!data.success) {
//       return res.status(400).json({
//         success:false,
//         message:'کپچا نامعتبر است'
//       })
//     }

//     next()
//   } catch (err) {
//     console.error('Turnstile verification error:', err.message)
//     return res.status(500).json({
//       success:false,
//       message:'خطا در بررسی کپچا'
//     })
//   }
// }