const axios=require('axios')

function sms(phone){
return axios.post(
    "https://api.iranpayamak.com/ws/v1/sms/pattern",

    {
       code: process.env.FARAZ_PATTERN_CODE,

       attributes:{
         
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