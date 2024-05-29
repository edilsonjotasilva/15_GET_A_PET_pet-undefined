const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//middleware to validation token
const checkToken = (req, res, next)=>{

    if (!req.headers.authorization) {
        return res.status(401).json({message: "Acesso Negado"})
    }

    const token = getToken(req)
    
    try {
        const verified = jwt.verify(token, 'nossosecret')

        console.log('token verificado ::::::::', verified)
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({message: "Token inválido"})

    }


}

module.exports = checkToken