const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




module.exports = {

    createUser: function(data) {
        return new User(data)
    },

    findById: function(id, projection = null) {
        return User.findById(id, projection)
    },

    findByName: function(name, projection = null) {
        return User.findOne({username: name}, projection )
    },

    // define method to find user by his credentials
    findByCred : async function(email, password) {
        const user = await User.findOne({email})
    
        if (!user) throw new Error('Unable to log in')
    
        const isMatch = await bcrypt.compare(password, user.password)
    
        if (!isMatch) throw new Error('Unable to log in')
    
        return user
    },
    
    generateAuthToken : async function (user) {
        const token = jwt.sign({_id: user._id.toString()},'omaha222')
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    }

    
}
