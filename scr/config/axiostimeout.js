const axios=require('axios')

const api=axios.create({
    timeout:20000
})

module.exports=api