const express = require("express");
const router = express.Router();
const authMdw = require("../bin/middleware/authMdw").auth;
const PostService = require("../bin/services/PostService");
const {
  validPost,
  processPost,
  deletePost,
  notifyFriendsAboutPost,
  notifyFriendsAboutDelete,
  getParentPost,
  notifyParent,
} = require("../bin/middleware/postMdw");

const finishPost = (req, res) => res.send(req.post);

router.post(
  "/",
  authMdw,
  validPost,
  processPost,
  notifyFriendsAboutPost,
  finishPost
);

router.post(
  "/reply",
  authMdw,
  validPost,
  getParentPost,
  processPost,
  notifyParent,
  finishPost
);

router.post("/edit", authMdw, async (req, res) => {
  const { text, post_id } = req.body;
  if (text === "" || text === null) return res.end();

  try {
    const updated = await PostService.update({ _id: post_id }, { body: text });

    return res.status(200).send(updated);
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/delete",
  authMdw,
  deletePost,
  notifyFriendsAboutDelete,
  finishPost
);

module.exports = router;
