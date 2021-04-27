var express = require("express");
var router = express.Router();

const authMdw = require("../bin/middleware/authMdw").auth;
const {
  getUser,
  getProfile,
  editProfile,
  uploadAvatar,
} = require("../bin/middleware/profileMdw");

//get user page

router.get("/:username", authMdw, getUser, getProfile);

router.post("/edit", authMdw, editProfile);

router.post("/avatar", authMdw, uploadAvatar);

module.exports = router;
