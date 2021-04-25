var express = require("express");
var router = express.Router();

const FriendsMapper = require("../bin/dataAccess/FriendsMapper");
const UserMapper = require("../bin/dataAccess/UserMapper");
const PostMapper = require("../bin/dataAccess/PostMapper");
const CloudinaryService = require("../bin/services/CloudinaryService");
const authMdw = require("../bin/middleware/authMdw").auth;

//get user page

router.get("/:username", authMdw, async function (req, res) {
  const { username } = req.params;

  const theUser = req.user;

  try {
    let user = await UserMapper.findByName(username);

    const executeInParallel = [
      (async () => {
        const accepted = await FriendsMapper.friends(user).exec();

        const posts = await PostMapper.getTimeline(user, accepted);

        await Promise.all(
          posts.map(async (post) => {
            const replies = await PostMapper.getReplys(post);
            post.rep = replies;
            return post;
          })
        );

        return { accepted, posts };
      })(),

      (async () => {
        const pending = await FriendsMapper.friendRequestsPending(user);

        const friendsPending = await Promise.all(
          pending.map(async (relation) => {
            return await UserMapper.findById(relation.user_id);
          })
        );

        return friendsPending;
      })(),

      FriendsMapper.hasSentRequest(theUser, user),
      FriendsMapper.hasFriendRequest(theUser, user),
      FriendsMapper.isFriendWith(theUser, user),
    ];

    Promise.all(executeInParallel).then((results) => {
      const [
        { accepted, posts },
        friendsPending,
        isRequestSend,
        isRequestPending,
        isFriend,
      ] = results;

      res.send({
        user,
        posts,
        friendsList: {
          accepted,
          pending: friendsPending,
        },
        isRequestSend,
        isRequestPending,
        isFriend: isFriend.length > 0 ? true : false,
      });
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: e.message });
  }
});

router.post("/edit", authMdw, async (req, res) => {
  const { body: updates, user } = req;

  const updatesArr = Object.keys(updates);

  if (updatesArr.some((el) => updates[el] !== user[el])) {
    updatesArr.forEach((prop) => {
      user[prop] = updates[prop];
    });

    await user.save();
    return res.status(200).send({
      user: user,
      msg: "Profile successfully updated",
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
      url: avatar.url,
      size: {
        width: avatar.width,
        height: avatar.height,
      },
    });
  } catch (e) {
    console.log("Error:", e);
    return res.end();
  }
});

module.exports = router;
