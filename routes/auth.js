var express = require("express");
var router = express.Router();
const Auth = require("../bin/services/AuthService");
const authMdw = require("../bin/middleware/authMdw").auth;
const validate = require("../bin/middleware/valid");

router.post("/signup", validate, async function (req, res) {
  try {
    const {
      user: { username, email, avatarUrl },
      token,
    } = await Auth.signup(req.body);

    return res
      .status(200)
      .send({ user: { username, email, avatarUrl, token } });
  } catch (e) {
    console.log(e, "signup error");
    res.status(500).send(e.message);
  }
});

//login
router.post("/signin", validate, async function (req, res) {
  try {
    const { username, email, avatarUrl, token } = await Auth.signin(req.body);

    res.status(200).send({ user: { username, email, avatarUrl, token } });
  } catch (e) {
    console.log(e, "signin error");
    res.status(500).send(e.message);
  }
});

router.post("/logout", authMdw, async function (req, res) {
  try {
    await Auth.logout(req.user, req.token);

    res.clearCookie("user").end();
  } catch (e) {
    console.log(e, "logout error");
    res.status(500).send(e.message);
  }
});

module.exports = router;
