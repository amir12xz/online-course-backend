const coursemodel=require('./../models/course')

module.exports=async(req,res)=>{
try{

const {
title,
shortdescription,
longdescription,
price,
spotplayerid,
sessionscount,
duration,
status,
tags
}=req.body

const courseid=req.params.courseid

if(courseid){

const updatedata={
title,
shortdescription,
longdescription,
price:Number(price),
spotplayercourseid:spotplayerid,
sessionscount:Number(sessionscount),
duration,
status,
tags
}

if(req.files?.thumbnail){
updatedata.thumbnail=`/coursethumbnails/${req.files.thumbnail[0].filename}`
}

if(req.files?.introvideo){
updatedata.introvideo=`/introvideo/${req.files.introvideo[0].filename}`
}

const editedcourse=await coursemodel.findByIdAndUpdate(
courseid,
updatedata,
{returnDocument:'after'}
)

if(!editedcourse){
return res.status(404).json({
success:false,
message:'دوره ای پیدا نشد'
})
}

return res.status(200).json({
success:true,
message:'دوره بروزرسانی شد',
course:editedcourse
})

}else{

if(!req.files?.thumbnail){
return res.status(400).json({
success:false,
message:'تصویر دوره نیاز است'
})
}


const thumbnail=`/coursethumbnails/${req.files.thumbnail[0].filename}`
const introvideo=`/introvideo/${req.files.introvideo[0].filename}`

const course=await coursemodel.create({
title,
shortdescription,
longdescription,
thumbnail,
introvideo,
price:Number(price),
spotplayercourseid:spotplayerid,
sessionscount:Number(sessionscount),
duration:Number(duration),
status,
tags
})

return res.status(200).json({
success:true,
message:'دوره اضافه شد',
course
})

}

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:'server error'
})

}
}