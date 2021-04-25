const Friends = require("../models/Friends");

module.exports = {
  addFriend: function (user, friend) {
    return Friends.create({
      user_id: user._id,
      friend_id: friend._id,
    });
  },

  getPair: function (user, friend) {
    return Friends.find({
      $or: [
        { $and: [{ user_id: user._id }, { friend_id: friend._id }] },

        { $and: [{ user_id: friend._id }, { friend_id: user._id }] },
      ],
    });
  },

  acceptFriendRequest: function (user, friend) {
    return this.friendRequestsPending(user).updateOne(
      { user_id: friend._id },
      { $set: { accepted: true, timestamp: new Date() } }
    );
  },

  deleteFriend: function (user, friend) {
    return Friends.deleteOne({
      $or: [
        { $and: [{ user_id: user._id }, { friend_id: friend._id }] },

        { $and: [{ user_id: friend._id }, { friend_id: user._id }] },
      ],
    });
  },

  //find friends_IDs that associate with user_id
  friendOfMine: function (user) {
    return Friends.find({ user_id: user._id });
  },

  //find user_IDs that associate with friend_id
  friendOf: function (user) {
    return Friends.find({ friend_id: user._id });
  },

  //find users whom you send requests
  friendRequests: function (user) {
    return this.friendOfMine(user).find({ accepted: "false" });
  },

  //find users who send requests to you
  friendRequestsPending: function (user) {
    return this.friendOf(user).find({ accepted: "false" });
  },

  //check if you have sent request to specific user (!!!Convert return value to Boolean AFTER await!!!)
  hasSentRequest: function (user, friend) {
    return this.friendRequests(user)
      .find({ friend_id: friend._id })
      .countDocuments();
  },

  //check if you have request from specific user (!!!Convert return value to Boolean AFTER await!!!)
  hasFriendRequest: function (user, friend) {
    return this.friendRequestsPending(user)
      .find({ user_id: friend._id })
      .countDocuments();
  },

  //check if you are friends with specific user (!!!check array length AFTER await!!!)
  isFriendWith: function (user, friend) {
    return this.friends(user).match({ _id: friend._id });
    //.count("count");
  },

  //find list of friends
  friends: function (user) {
    return Friends.aggregate([
      { $match: { accepted: true } },
      {
        $match: {
          $or: [{ user_id: user._id }, { friend_id: user._id }],
        },
      },
      {
        $project: {
          _id: 0,
          timestamp: 1,
          friend_id: {
            $cond: {
              if: { $ne: ["$user_id", user._id] },
              then: "$user_id",
              else: {
                $cond: {
                  if: { $ne: [user._id, "$friend_id"] },
                  then: "$friend_id",
                  else: "",
                },
              },
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "friend_id",
          foreignField: "_id",
          as: "friend_id",
        },
      },
      { $unwind: "$friend_id" },

      {
        $project: {
          avatarUrl: "$friend_id.avatarUrl",
          username: "$friend_id.username",
          email: "$friend_id.email",
          befriended: "$timestamp",
          _id: "$friend_id._id",
        },
      },
    ]);
  },

  pendings: function (user) {
    return Friends.aggregate([
      {
        $match: {
          $and: [{ friend_id: user._id }, { accepted: false }],
        },
      },
    ]);
  },
};
