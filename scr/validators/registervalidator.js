const {body}=require('express-validator')


module.exports=[

body('name')
.trim()
.notEmpty()
.withMessage('name is required'),


body('lastname')
.trim()
.notEmpty()
.withMessage('lastname is required'),


body('phone')
.trim()
.notEmpty()
.withMessage('phone is required')
.isMobilePhone('fa-IR')
.withMessage('invalid phone number'),


body('password')
.trim()
.notEmpty()
.withMessage('password is required')
.isLength({min:8})
.withMessage('password must be 8 characters')

]