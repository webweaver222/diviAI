const User = require("../models/User");
const jwt = require("jsonwebtoken");

const findUser = (token) => {
  const decoded = jwt.verify(token, "omaha222");
  const user = User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });

  return user;
};

const auth = async function (req, res, next) {
  const token = req.headers.token;

  //check if token form user is valid
  try {
    const user = await findUser(token);

    if (!user) throw new Error("orgon");

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = { auth, findUser };
