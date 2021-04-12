var url = require("url");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

module.exports = function (wss) {
  wss.on("connection", async function connection(ws, request) {
    const token = url.parse(request.url, true).query.token;

    const decoded = jwt.verify(token, "omaha222");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    console.log(user);

    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    ws.on("close", function close() {
      console.log("klose");
    });
  });
};
