const mongoose = require('mongoose')



const friendsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    friend_id : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    accepted: {
        type: Boolean,
        default: false
    },

    timestamp: { 
        type: Date, 
        default: Date.now
    }



}) 

const Friends = mongoose.model('Friends', friendsSchema)

module.exports = Friends