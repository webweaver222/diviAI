const PostMapper = require("../dataAccess/PostMapper");
const FriendsMapper = require("../dataAccess/FriendsMapper");
const UserSocketMap = require("../services/UserSocketMap");
const UserMapper = require("../dataAccess/UserMapper");

class PostService {
  validPost(post) {
    if (post === "") return false;
    return true;
  }

  async processPost(user, parent, postBody) {
    let post = PostMapper.createPost({
      body: postBody,
      user: user._id,
      parent: parent,
    });

    await post.save();

    post = post.toObject();
    post.rep = [];
    return post;
  }

  async deletePost(post_id) {
    await PostMapper.deleteAll({ parent: post_id });

    const post = await PostMapper.deleteById(post_id);

    return post;
  }

  async editPost(_id, body) {
    return await PostMapper.update({ _id }, { body });
  }

  async getParentPost(parent_id) {
    const parentPost = await PostMapper.findById(parent_id);

    const parent = await UserMapper.getUser(parentPost);

    if (!parent) throw new Error("no such post found");

    return parent;
  }

  notifyParent(parent_user_id, user, post) {
    const ws = UserSocketMap.get(String(parent_user_id));

    if (ws)
      ws.send(
        JSON.stringify({
          type: "FRIEND_REPLY",
          payload: {
            user,
            post,
          },
        })
      );
  }

  notifyFriends(notifFunction) {
    return async function (user, post) {
      const friends = await FriendsMapper.friends(user);

      friends.forEach((friend) => {
        const ws = UserSocketMap.get(String(friend._id));

        if (ws) notifFunction(ws, user, post);
      });
    };
  }

  AboutPost(ws, user, post) {
    ws.send(
      JSON.stringify({
        type: "FRIEND_POST",
        payload: {
          user,
          post,
        },
      })
    );
  }

  AboutDelete(ws, user, post) {
    ws.send(
      JSON.stringify({
        type: "FRIEND_POST_DELETE",
        payload: {
          post,
        },
      })
    );
  }
}

module.exports = new PostService();
