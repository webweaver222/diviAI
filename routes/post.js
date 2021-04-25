const express = require("express");
const router = express.Router();
const authMdw = require("../bin/middleware/authMdw").auth;
const PostService = require("../bin/services/PostService");
const {
  validPost,
  processPost,
  deletePost,
  editPost,
  notifyFriendsAboutPost,
  notifyFriendsAboutDelete,
  getParentPost,
  notifyParent,
} = require("../bin/middleware/postMdw");

const finishPost = (req, res) => res.status(200).send(req.post);

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

router.post("/edit", authMdw, editPost, finishPost);

router.post(
  "/delete",
  authMdw,
  deletePost,
  notifyFriendsAboutDelete,
  finishPost
);

module.exports = router;
