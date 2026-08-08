const crypto = require('crypto')

function codemaker(){
    return crypto.randomInt(10000,100000)
}

module.exports=codemaker