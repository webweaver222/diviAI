const Post = require('../models/Post')
const User = require('../models/User')


module.exports = {
    createPost : function(data) {
        return new Post(data)
    },
    findById: function(id) {
        return Post.findById(id)
    },
    getPosts: function (user) {
        return  user.populate('posts').execPopulate()

    },
    getAllPosts: function (user, friendsAccepted) {
        return Post.aggregate([
            {$match: {
                $or : [
                    {user: user._id},
                    {
                      user: {
                          $in: friendsAccepted.map((friend) => friend._id)
                      }
                    }
                ]
            }},
            {$sort: {timestamp: -1}},
            {$lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }},
            {$project: {
                "user.password": false,
                "user.tokens": false
            }}
        ])
    }
}