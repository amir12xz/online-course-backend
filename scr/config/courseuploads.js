const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({

destination:(req,file,cb)=>{

if(file.fieldname==='thumbnail'){
return cb(null,path.join(__dirname,'./../public/coursethumbnails'))
}

if(file.fieldname==='introvideo'){
return cb(null,path.join(__dirname,'./../public/introvideo'))
}

return cb(new Error('فیلد فایل نامعتبر است'))

},

filename:(req,file,cb)=>{
cb(null,Date.now()+'-'+file.originalname)
}

})

const fileFilter=(req,file,cb)=>{

if(file.fieldname==='thumbnail'){

if(!file.mimetype.startsWith('image/')){
return cb(new Error('فایل thumbnail باید تصویر باشد'))
}

return cb(null,true)
}

if(file.fieldname==='introvideo'){

if(!file.mimetype.startsWith('video/')){
return cb(new Error('فایل introvideo باید ویدیو باشد'))
}

return cb(null,true)
}

cb(new Error('فیلد فایل نامعتبر است'))

}

const upload=multer({
storage:storage,
fileFilter:fileFilter,
limits:{
fileSize:50*1024*1024
}
})

module.exports=upload