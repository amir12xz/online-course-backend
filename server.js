const mongo=require('mongoose')
const server=require('./app')

async function connect(){
await mongo.connect(process.env.MONGO)
}connect()

server.listen(5000,()=>{
    console.log('server run')
})