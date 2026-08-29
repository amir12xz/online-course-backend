const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try {

        const token = req.cookies.token

       
        if (!token)
            return next()

        jwt.verify(token, process.env.JWT)

      
        return res.status(401).json({
            success: false,
            message: 'شما قبلا وارد شده اید'
        })

    } catch (err) {

    
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })

        return next()
    }
}