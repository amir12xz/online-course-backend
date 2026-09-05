const axios=require('axios')

async function createLicense(name,course,watermark,test=false){

const response=await axios.post(
'https://panel.spotplayer.ir/license/edit/',
{
test,
course:[course],
name,
watermark:{
texts:[
{
text:watermark
}
]
}
},
{
headers:{
'$API':process.env.SPOTID,
'$LEVEL':'-1',
'Content-Type':'application/json'
},
            timeout:20000
}
)

return response.data
}

module.exports=createLicense