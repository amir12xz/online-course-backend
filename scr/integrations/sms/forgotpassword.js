const axios=require('axios')

function sms(password,phone){
return axios.post(
    "https://api.iranpayamak.com/ws/v1/sms/pattern",

    {
       code: process.env.FARAZ_PATTERN_CODE,

       attributes:{
          code:password
       },
       recipient:phone,

       line_number:process.env.PHONE,

       number_format:"english"
    },
    {
       headers:{
          "Api-Key":process.env.FARAZ_API
       },
            timeout:20000
    }
)
}

module.exports=sms