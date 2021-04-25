const Post = require("../models/Post");

module.exports = {
  createPost: function (data) {
    return new Post(data);
  },
  findById: function (id) {
    return Post.findById(id);
  },
  deleteAll: function (match) {
    return Post.deleteMany(match);
  },
  update: function (query, update) {
    return Post.findOneAndUpdate(query, update, { new: true });
  },
  deleteById: function (id) {
    return Post.findOneAndDelete({ _id: id });
  },
  getPosts: function (user) {
    return user.populate("posts").execPopulate();
  },

  getReplys: function (post) {
    return Post.aggregate([
      {
        $match: {
          parent: post._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { timestamp: -1 } },
    ]);
  },

  getTimeline: function (user, friendsAccepted) {
    return Post.aggregate([
      {
        $match: {
          $or: [
            { user: user._id },
            {
              user: {
                $in: friendsAccepted.map((friend) => friend._id),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          isStarted: {
            $filter: {
              input: friendsAccepted,
              as: "friend",
              cond: { $eq: ["$$friend._id", "$user._id"] },
            },
          },
        },
      },
      {
        $project: {
          isStarted: {
            $cond: [
              { $gt: [{ $size: "$isStarted" }, 0] },
              "$isStarted.befriended",
              [null],
            ],
          },
          body: 1,
          user: 1,
          timestamp: 1,
          parent: 1,
        },
      },
      { $unwind: "$isStarted" },
      {
        $match: {
          $or: [
            {
              "user._id": user._id,
            },
            {
              $expr: {
                $gte: ["$timestamp", "$isStarted"],
              },
            },
          ],
        },
      },
      { $sort: { timestamp: -1 } },
    ]);
  },
};
