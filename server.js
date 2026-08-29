const mongo=require('mongoose')
const server=require('./app')

async function start() {
    try {

  const required = [
    'JWT',
    'MONGO',
    'ZARINPALID',
    'ZARINPALCALLBACK',
    'SPOTID',
    'PHONE',
    'FARAZ_API',
    'FARAZ_PATTERN_CODE'
  ]
  const missing=required.filter(key=>!process.env[key]);
  if (missing.length>0){
    console.error('مشکل در env')
    missing.forEach(key => console.error('  -', key))
    process.exit(1)
  }

        await mongo.connect(process.env.MONGO)


        server.listen(5000, () => {
            console.log('server run')
        })
    } catch (err) {
        console.error('MongoDB connection failed:', err)
        process.exit(1)
    }
}


start()