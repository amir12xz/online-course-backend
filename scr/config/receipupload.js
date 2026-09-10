const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === 'receipt') {

            return cb(
                null,
                path.join(__dirname, './../public/receips')
            )

        }

        return cb(new Error('فیلد فایل نامعتبر است'))

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + '-' + file.originalname
        )

    }

})

const fileFilter = (req, file, cb) => {

    if (file.fieldname !== 'receipt') {

        return cb(new Error('فیلد فایل نامعتبر است'))

    }

    if (!file.mimetype.startsWith('image/')) {

        return cb(
            new Error('فایل رسید باید تصویر باشد')
        )

    }

    cb(null, true)

}

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

})

module.exports = upload