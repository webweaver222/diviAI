const UserService = require("../services/UserService");
const FriendsService = require("../services/FriendsService");
const UserSocketMap = require("../services/UserSocketMap");
const PostService = require("../services/PostService");

const notifyParent = async (req, res, next) => {
  const { user, post, parent } = req;

  const ws = UserSocketMap.get(String(parent.user._id));

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

  next();
};

const notifyFriends = (notifFunction) => async (req, res, next) => {
  const { user, post } = req;

  const friends = await FriendsService.friends(user);

  friends.forEach((friend) => {
    const ws = UserSocketMap.get(String(friend._id));

    if (ws) notifFunction(ws, user, post);
  });

  next();
};

const notifyFriendsAboutPost = notifyFriends((ws, user, post) =>
  ws.send(
    JSON.stringify({
      type: "FRIEND_POST",
      payload: {
        user,
        post,
      },
    })
  )
);

const notifyFriendsAboutDelete = notifyFriends((ws, user, post) =>
  ws.send(
    JSON.stringify({
      type: "FRIEND_POST_DELETE",
      payload: {
        post,
      },
    })
  )
);

const processPost = async function (req, res, next) {
  const {
    user,
    parent,
    body: { post: postBody },
  } = req;

  try {
    let post = PostService.createPost({
      body: postBody,
      user: user._id,
      parent: parent,
    });

    await post.save();

    post = post.toObject();
    post.rep = [];
    req.post = post;

    return next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getParentPost = async (req, res, next) => {
  try {
    const parentPost = await PostService.findById(req.body.parent_id);

    const parent = await UserService.getUser(parentPost);

    if (!parent) return res.status(400).send("cant find that post");

    req.parent = parent;

    return next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

const validPost = (req, res, next) => {
  if (req.body.post === "") return res.end();
  return next();
};

const deletePost = async (req, res, next) => {
  const { post_id } = req.body;
  if (!post_id) return res.end();

  try {
    await PostService.deleteAll({ parent: post_id });

    const post = await PostService.deleteById(post_id);

    req.post = post;

    next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = {
  validPost,
  getParentPost,
  processPost,
  deletePost,
  notifyFriendsAboutPost,
  notifyFriendsAboutDelete,
  notifyParent,
};
