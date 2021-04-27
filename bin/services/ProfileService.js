const UserMapper = require("../dataAccess/UserMapper");
const FriendsMapper = require("../dataAccess/FriendsMapper");
const PostMapper = require("../dataAccess/PostMapper");
const CloudinaryService = require("../services/CloudinaryService");

class ProfileService {
  getUser(username) {
    return UserMapper.findByName(username);
  }

  getProfile(theUser, user) {
    return Promise.all([
      (async () => {
        const accepted = await this.getAcceptedFrieds(user);
        const posts = await this.getAllPosts(user, accepted);

        return { accepted, posts };
      })(),

      this.getPendingFriends(user),
      FriendsMapper.hasSentRequest(theUser, user),
      FriendsMapper.hasFriendRequest(theUser, user),
      FriendsMapper.isFriendWith(theUser, user),
    ]);
  }

  getAcceptedFrieds(user) {
    return FriendsMapper.friends(user).exec();
  }

  async getAllPosts(user, accepted) {
    const posts = await PostMapper.getTimeline(user, accepted);

    return Promise.all(
      posts.map(async (post) => {
        const replies = await PostMapper.getReplys(post);
        post.rep = replies;
        return post;
      })
    );
  }

  async getPendingFriends(user) {
    const pending = await FriendsMapper.friendRequestsPending(user);

    return Promise.all(
      pending.map(async (relation) => {
        return await UserMapper.findById(relation.user_id);
      })
    );
  }

  async editProfile(updates, user) {
    const updatesArr = Object.keys(updates);

    if (updatesArr.some((el) => updates[el] !== user[el])) {
      updatesArr.forEach((prop) => {
        user[prop] = updates[prop];
      });

      await user.save();
    }

    return user;
  }

  async uploadAvatar(base64, user) {
    const avatar = await CloudinaryService.save(base64);
    user.avatarUrl = avatar.url;
    await user.save();
    return avatar;
  }
}

module.exports = new ProfileService();
