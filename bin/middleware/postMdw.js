const PostService = require("../services/PostService");

const notifyParent = async (req, res, next) => {
  const { user, post, parent } = req;

  PostService.notifyParent(parent.user._id, user, post);

  next();
};

const notifyFriendsAboutPost = async (req, res, next) => {
  const { user, post } = req;

  PostService.notifyFriends(PostService.AboutPost)(user, post);
  next();
};

const notifyFriendsAboutDelete = async (req, res, next) => {
  const { user, post } = req;

  PostService.notifyFriends(PostService.AboutDelete)(user, post);
  next();
};

const processPost = async function (req, res, next) {
  const {
    user,
    parent,
    body: { post: postBody },
  } = req;

  try {
    const post = await PostService.processPost(user, parent, postBody);
    req.post = post;

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

const getParentPost = async (req, res, next) => {
  try {
    const parent = await PostService.getParentPost(req.body.parent_id);

    req.parent = parent;

    next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

const validPost = (req, res, next) => {
  if (!PostService.validPost(req.body.post)) return res.end();
  next();
};

const deletePost = async (req, res, next) => {
  const { post_id } = req.body;
  if (!post_id) return res.end();

  try {
    const post = await PostService.deletePost(post_id);

    req.post = post;

    next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

const editPost = async (req, res, next) => {
  const { text, post_id } = req.body;
  if (text === "") return res.end();

  try {
    const updated = await PostService.editPost(post_id, text);

    req.post = updated;
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
  editPost,
  notifyFriendsAboutPost,
  notifyFriendsAboutDelete,
  notifyParent,
};
