const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Friends = require('../models/Friends')

//User schema creation
const userSchema = mongoose.Schema({
    username : {
        type: String
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

     timestamp: { 
        type: Date, 
        default: Date.now
    }
})

// Pre user-save middleware
userSchema.pre('save', async function(next) {
    

    //check if this is completly new user or this is update ( where password was updated). Only in this cases hash passwaord
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)
    next()
})

// define method to find user by his credentials
userSchema.statics.findByCred = async function(email, password) {
    const user = await User.findOne({email})

    if (!user) throw new Error('Unable to log in')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to log in')

    return user
    
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'omaha222')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

/////////////////////-- DB QUERYS -- /////////////////////////////////////////////////////////

userSchema.methods.addFriend = async function(friend) {

    try {
        const doc = await Friends.create({
            user_id : this._id,
            friend_id: friend._id
        })
      return
    } catch (e) {
       throw new e
    } 
}

userSchema.methods.acceptFriendRequest = async function(friend) {
   

   
       
}


//find friends_IDs that associate with user_id
userSchema.methods.friendOfMine = function() {
    return Friends.find({user_id: this._id})
}

//find user_IDs that associate with friend_id
userSchema.methods.friendOf = function() {
    return Friends.find({friend_id: this._id})
}


//find users whom you send requests
userSchema.methods.friendRequests = async function() {
   return await this.friendOfMine().find({accepted: 'false'})
}

//find users who send requests to you
userSchema.methods.friendRequestsPending = async function() {
    return this.friendOf().find({accepted: 'false'})
}

//find list of friends
userSchema.methods.friends = async function() {
    return await this.friendOfMine().find({accepted: 'true'})
}



const User = mongoose.model('User', userSchema)

module.exports = User