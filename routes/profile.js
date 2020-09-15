var express = require("express");
var router = express.Router();

const FriendsService = require("../bin/services/FriendsService");
const UserService = require("../bin/services/UserService");
const PostService = require("../bin/services/PostService");
const CloudinaryService = require("../bin/services/CloudinaryService");
const authMdw = require("../bin/middleware/authMdw");

//get user page

router.get("/:username", authMdw, async function(req, res) {
  const { username } = req.params;

  const theUser = req.user;

  try {
    let user = await UserService.findByName(username);

    const accepted = await FriendsService.friends(user).exec();

    const pending = await FriendsService.friendRequestsPending(user);

    const friendsPending = await Promise.all(
      pending.map(async relation => {
        return await UserService.findById(relation.user_id);
      })
    );

    const posts = await PostService.getTimeline(user, accepted);

    try {
      await Promise.all(
        posts.map(async post => {
          const replies = await PostService.getReplys(post);
          post.rep = replies;
          return post;
        })
      );
    } catch (e) {
      console.log(e);
    }

    res.send({
      user,
      posts,
      friendsList: {
        accepted: accepted,
        pending: friendsPending
      },
      isRequestSend: Boolean(
        await FriendsService.hasSentRequest(theUser, user)
      ),
      isRequestPending: Boolean(
        await FriendsService.hasFriendRequest(theUser, user)
      ),
      isFriend:
        (await FriendsService.isFriendWith(theUser, user)).length > 0
          ? true
          : false
    });
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

router.post("/edit", authMdw, async (req, res) => {
  const { body: updates, user } = req;

  const updatesArr = Object.keys(updates);

  if (updatesArr.some(el => updates[el] !== user[el])) {
    updatesArr.forEach(prop => {
      user[prop] = updates[prop];
    });

    await user.save();
    return res.status(200).send({
      user: user,
      msg: "Profile successfully updated"
    });
  }

  return res.status(304).end();
});

router.post("/avatar", authMdw, async (req, res) => {
  const { base64 } = req.body;
  const user = req.user;

  const Cloudinary = new CloudinaryService();
  try {
    const avatar = await Cloudinary.save(base64);
    user.avatarUrl = avatar.url;
    await user.save();
    return res.status(200).send({
      user: user,
      msg: "Avatar successfully updated"
    });
  } catch (e) {
    console.log("Error:", e);
    return res.end();
  }
});

module.exports = router;
