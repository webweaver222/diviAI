
const admin = async function(req,res,next) {

    const {user} = req

    if (user.email === 'fukiry@gmail.com') {
        return next()
    }

    console.log('Please log in as admin')

    return res.status(401).send({error:'Please log in as admin'})
}

module.exports = admin