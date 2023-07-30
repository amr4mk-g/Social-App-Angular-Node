const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1]
        let decoded = jwt.verify(token, 'secretKey')
        req.userData = {name: decoded.name, id: decoded.id}
        next()
    } catch(err) {
        res.status(401).json({message: 'You are not authorized'})
    }
}