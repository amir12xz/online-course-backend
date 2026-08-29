const mongoose = require('mongoose')

module.exports = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName]
        if (!id) {
            return next()
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'لینک نامعتبر'
            })
        }
        next()
    }
}