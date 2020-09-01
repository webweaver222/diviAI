var express = require("express");
var router = express.Router();
const UserService = require("../bin/services/UserService");
const authMdw = require("../bin/middleware/authMdw");
const validate = require("../bin/middleware/valid");

router.post("/signup", validate, async function(req, res) {
  let user = UserService.createUser(req.body);

  //register new user
  try {
    user = await user.save();
    const token = await UserService.generateAuthToken(user);
    return res
      .status(200)
      .cookie("user", token)
      .send({ user });
  } catch (e) {
    console.log(e);
    return res.send({ message: e.message });
  }
});

//login
router.post("/signin", validate, async function(req, res) {
  try {
    const user = await UserService.findByCred(
      req.body.email,
      req.body.password
    );
    const { username, email, avatarUrl } = user;

    const token = await UserService.generateAuthToken(user);
    res.status(200).send({ user: { username, email, avatarUrl, token } });
  } catch (e) {
    console.log(e);
    res.status(401).send(e.message);
  }
});

router.post("/logout", authMdw, async function(req, res) {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();

    res.clearCookie("user").end();
  } catch (e) {
    res.status(500).send({ msg: e });
  }
});

module.exports = router;
