const FriendsMapper = require("../dataAccess/FriendsMapper");
const UserMapper = require("../dataAccess/UserMapper");

class FriendsService {
  async addFriend(friend_id, user) {
    const friend = await UserMapper.findById(friend_id);

    //dont try to befriend yourself
    if (user._id === friend._id) {
      return res.end();
    }

    //if no such user
    if (!friend) throw new Error("no such user was found");

    //if friend reqest already was send
    if (
      Boolean(await FriendsMapper.hasSentRequest(user, friend)) ||
      Boolean(await FriendsMapper.hasFriendRequest(user, friend))
    )
      throw new Error("Friend request is already pending");

    // if already are friends
    if ((await FriendsMapper.isFriendWith(user, friend)).length > 0)
      throw new Error("You are friends with that user");

    await FriendsMapper.addFriend(user, friend);

    return friend;
  }

  async acceptFriend(friend_id, user) {
    const friend = await UserMapper.findById(friend_id);

    if (!friend) throw new Error("No such user was found");

    //if user did not have request pending from specific user(friend)
    if (!Boolean(await FriendsMapper.hasFriendRequest(user, friend)))
      throw new Error("You dont have friend request from thar user");

    await FriendsMapper.acceptFriendRequest(user, friend);

    return friend;
  }

  async removeFriend(friend_id, user) {
    const friend = await UserMapper.findById(friend_id);

    if (!friend) throw new Error("No such user was found");

    if ((await FriendsMapper.isFriendWith(user, friend).length) === 0)
      throw new Error("You are not friends with that user");

    return await FriendsMapper.deleteFriend(user, friend);
  }
}

module.exports = new FriendsService();
