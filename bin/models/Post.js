const mongoose = require('mongoose')





const postSchema = mongoose.Schema({
    body: {
        type: String
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User' 
    },

    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post