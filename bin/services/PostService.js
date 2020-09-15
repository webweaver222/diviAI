const Post = require("../models/Post");
const FriendsService = require("./FriendsService");

module.exports = {
  createPost: function(data) {
    return new Post(data);
  },
  findById: function(id) {
    return Post.findById(id);
  },
  deleteAll: function(match) {
    return Post.deleteMany(match);
  },
  deleteById: function(id) {
    return Post.findOneAndDelete({ _id: id });
  },
  getPosts: function(user) {
    return user.populate("posts").execPopulate();
  },

  getReplys: function(post) {
    return Post.aggregate([
      {
        $match: {
          parent: post._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $sort: { timestamp: -1 } }
    ]);
  },

  getTimeline: function(user, friendsAccepted) {
    return Post.aggregate([
      {
        $match: {
          $or: [
            { user: user._id },
            {
              user: {
                $in: friendsAccepted.map(friend => friend._id)
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $addFields: {
          isStarted: {
            $filter: {
              input: friendsAccepted,
              as: "friend",
              cond: { $eq: ["$$friend._id", "$user._id"] }
            }
          }
        }
      },
      {
        $project: {
          isStarted: {
            $cond: [
              { $gt: [{ $size: "$isStarted" }, 0] },
              "$isStarted.befriended",
              [null]
            ]
          },
          body: 1,
          user: 1,
          timestamp: 1,
          parent: 1
        }
      },
      { $unwind: "$isStarted" },
      {
        $match: {
          $or: [
            {
              "user._id": user._id
            },
            {
              $expr: {
                $gte: ["$timestamp", "$isStarted"]
              }
            }
          ]
        }
      },
      { $sort: { timestamp: -1 } }
    ]);
  },

  getAllPosts: function(user, friendsAccepted) {
    return Post.aggregate([
      {
        $match: {
          $or: [
            { user: user._id },
            {
              user: {
                $in: friendsAccepted.map(friend => friend._id)
              }
            }
          ]
        }
      },
      { $sort: { timestamp: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "posts",
          localField: "parent",
          foreignField: "_id",
          as: "parent"
        }
      },
      {
        $unwind: {
          path: "$parent",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "parent.user",
          foreignField: "_id",
          as: "parent.user"
        }
      },
      {
        $unwind: {
          path: "$parent.user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "user.tokens": 0,
          "user.password ": 0
        }
      },
      {
        $project: {
          body: 1,
          user: 1,
          timestamp: 1,
          parent: {
            $cond: [{ $eq: ["$parent", {}] }, null, "$parent"]
          }
        }
      }
      //{$limit: Number(limit)}
    ]);
  }
};
