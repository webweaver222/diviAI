var express = require("express");
var router = express.Router();
const authMdw = require("../bin/middleware/authMdw").auth;

/* GET home page. */
router.get("/", authMdw, async function (req, res, next) {
  const theUser = req.user;

  res.status(200).send({
    user: theUser,
  });
});

module.exports = router;
