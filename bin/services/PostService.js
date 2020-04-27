const Post = require('../models/Post')



module.exports = {
    createPost : function(data) {
        return new Post(data)
    },
    findById: function(id) {
        return Post.findById(id)
    },
    deleteAll: function(match) {
        return Post.deleteMany(match)
    },
    deleteById: function(id) {
        return Post.deleteOne({_id: id})
    },
    getPosts: function (user) {
        return  user.populate('posts').execPopulate()

    },
    getAllPosts: function (user, friendsAccepted, limit) {
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
            {
                $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
                }
            },
            {$unwind: "$user"},
            {
                $lookup: {
                    from: "posts",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent"
                }
            },
            {$unwind: {
                path :'$parent', 
                preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "parent.user",
                    foreignField: "_id",
                    as: "parent.user"
                }
            },
            {$unwind: {
                path :'$parent.user', 
                preserveNullAndEmptyArrays: true}
            },
            {$project: {
                "user.tokens" : 0,
                "user.password ": 0
            }},
            {$project: {
                "body" : 1,
                "user": 1,
                "timestamp":1,
                "parent": {
                    $cond: [ { $eq: [ "$parent", {} ] }, null, "$parent" ]
                }
            }},
           {$limit: Number(limit)}
          
        ])
    } 
}