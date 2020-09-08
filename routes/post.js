const express = require("express");
const router = express.Router();
const authMdw = require("../bin/middleware/authMdw");
const io = require("../bin/www").io;
const PostService = require("../bin/services/PostService");
const UserService = require("../bin/services/UserService");

const processPost = async function(req, res) {
  if (req.body.post === "") return res.end();
  const postBody = req.body.post;
  const parentPostId = req.body.parent_id ? req.body.parent_id : null;
  const user = req.user;
  let parentPost;

  if (parentPostId) {
    parentPost = await PostService.findById(parentPostId);
    parentPost = await UserService.getUser(parentPost);

    if (!parentPost) return res.status(400).send("cant find that post");
  }

  const post = PostService.createPost({
    body: postBody,
    user: user._id,
    parent: parentPost
  });

  try {
    await post.save();

    /*if (parentPostId) {
      const io = req.app.get("socketio");

      io.sockets.in(parentPost.user.username).emit("test", { msg: "hello" });
    }*/

    res.send(post);
  } catch (e) {
    return res.status(500).send(e);
  }
};

router.post("/", authMdw, processPost);

router.post("/reply", authMdw, processPost);

router.post("/edit", authMdw, async (req, res) => {
  const { text, post_id } = req.body;
  if (text === "" || text === null) return res.end();

  const post = await PostService.findById(post_id);

  await post.update({ body: text });

  return res.status(200).end();
});

router.post("/delete", authMdw, async (req, res) => {
  const { post_id } = req.body;
  if (post_id == null) return res.end();

  await PostService.deleteAll({ parent: post_id });

  await PostService.deleteById(post_id);
  return res.end();
});

module.exports = router;
