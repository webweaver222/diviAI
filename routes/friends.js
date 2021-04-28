const express = require("express");
var router = express.Router();
const authMdw = require("../bin/middleware/authMdw").auth;
const FriendsService = require("../bin/services/FriendsService");

router.post("/add", authMdw, async function (req, res) {
  const user = req.user;
  try {
    const friend = await FriendsService.addFriend(req.body.friend_id, user);

    res.send({ msg: `You send reqest to ${friend.username}` });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/accept", authMdw, async function (req, res) {
  const user = req.user;
  try {
    const friend = await FriendsService.acceptFriend(req.body.friend_id, user);

    return res.send({ msg: `You just added ${friend.email}` });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/remove", authMdw, async function (req, res) {
  const user = req.user;

  try {
    await FriendsService.removeFriend(req.body.friend_id, user);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
module.exports = router;
