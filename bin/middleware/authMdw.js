
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async function(req, res,next) {
    const token = req.cookies.user
    
    
    //check if token form user is valid
    try {
        const decoded = jwt.verify(token, 'omaha222')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error()

        req.token = token
        req.user = user
        next()
    } catch (e) {
        //TODO write notification{
            res.status(401).send({error:'Please authenticate!'})
    }
}


module.exports = auth