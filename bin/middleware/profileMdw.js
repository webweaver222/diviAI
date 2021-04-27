const ProfileService = require("../services/ProfileService");

const getUser = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await ProfileService.getUser(username);

    req.requestedUser = user;
    next();
  } catch (e) {
    res.status(404).send(e);
  }
};

const getProfile = async (req, res) => {
  const { user, requestedUser } = req;

  try {
    const profile = await ProfileService.getProfile(user, requestedUser);
    const [
      { accepted, posts },
      friendsPending,
      isRequestSend,
      isRequestPending,
      isFriend,
    ] = profile;

    res.send({
      user: requestedUser,
      posts,
      friendsList: {
        accepted,
        pending: friendsPending,
      },
      isRequestSend,
      isRequestPending,
      isFriend: isFriend.length > 0 ? true : false,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const editProfile = async (req, res) => {
  const { body: updates, user } = req;

  const updated = await ProfileService.editProfile(updates, user);

  return res.status(200).send({
    user: updated,
    msg: "Profile successfully updated",
  });
};

const uploadAvatar = async (req, res) => {
  const { base64 } = req.body;
  const user = req.user;

  try {
    const avatar = await ProfileService.uploadAvatar(base64, user);
    return res.status(200).send({
      url: avatar.url,
      size: {
        width: avatar.width,
        height: avatar.height,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = {
  getUser,
  getProfile,
  editProfile,
  uploadAvatar,
};
