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

userSchema.methods.addFriend = function(friend) {
    return Friends.create({
            user_id : this._id,
            friend_id: friend._id
        })
}

userSchema.methods.acceptFriendRequest = function(friend) {
    return this.friendRequestsPending().updateOne({user_id: friend._id},{$set:{accepted: true}})
}


userSchema.methods.deleteFriend = function(friend) {
    return this.friends().deleteOne({$or: 
        [
            {user_id: friend._id}, 
            {friend_id: friend._id}
        ]})
}
//////////////////////////////////////////////////////////////

//find friends_IDs that associate with user_id
userSchema.methods.friendOfMine = function() {
    return Friends.find({user_id: this._id})
}

//find user_IDs that associate with friend_id
userSchema.methods.friendOf = function() {
    return Friends.find({friend_id: this._id})
}

//////////////////////////////////////////////////////////////////

//find users whom you send requests
userSchema.methods.friendRequests = function() {
   return this.friendOfMine().find({accepted: 'false'})
}


//find users who send requests to you
userSchema.methods.friendRequestsPending = function() {
    return this.friendOf().find({accepted: 'false'})
}

/////////////////////////////////////////////////////////////////

//check if you have sent request to specific user (!!!Convert return value to Boolean AFTER await!!!)
userSchema.methods.hasSentRequest = function(friend) {
    return this.friendRequests().find({friend_id: friend._id}).countDocuments() 
 }

//check if you have request from specific user (!!!Convert return value to Boolean AFTER await!!!)
userSchema.methods.hasFriendRequest = function(friend) {
    return this.friendRequestsPending().find({user_id: friend._id}).countDocuments() 
 }

 //check if you are friends with specific user (!!!Convert return value to Boolean AFTER await!!!)
userSchema.methods.isFriendWith = function(friend) {
    return this.friends().find({$or:
        [ 
            {user_id: this._id, friend_id: friend._id},
            {user_id: friend._id, friend_id: this._id }
        ]}).countDocuments() 
}

 //////////////////////////////////////////////////////////////

//find list of friends
userSchema.methods.friends =  function() {
    return Friends.find({$or:
        [ 
            {user_id: this._id},
            {friend_id: this._id}
        ]}).where('accepted').equals(true) 
}




const User = mongoose.model('User', userSchema)

module.exports = User