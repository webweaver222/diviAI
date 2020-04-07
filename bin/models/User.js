const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


//User schema creation
const userSchema = mongoose.Schema({
    username : {
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    tokens: [{
        token: {
            type: String,
            reqired: true
        }
        
     }],
    
     avatarUrl: {
        type: String,
        default: ''
     },

     timestamp: { 
        type: Date, 
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    //check if this is completly new user or this is update ( where password was updated). Only in this cases hash passwaord
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User