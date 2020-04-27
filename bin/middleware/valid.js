const v = require('../services/validation')

const validate = async function (req, res, next) {
    console.log(req.route.path.indexOf('signup'))

    req.route.path.indexOf('signup') > 0 ? 
    await v.validateSignUp(req.body):  
    await v.validateSignIn(req.body)
  
   

    if (Object.keys(v.errors).length > 0) {

        return res.status(400).send({ errors: v.errors })
    }

    return next()
}


module.exports = validate