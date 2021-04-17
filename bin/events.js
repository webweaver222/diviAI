const url = require("url");
const { findUser } = require("./middleware/authMdw");
const UserSocket = require("./services/UserSocketMap");

module.exports = function (wss) {
  wss.on("connection", async function connection(ws, request) {
    const token = url.parse(request.url, true).query.token;

    const user = await findUser(token);

    if (user) UserSocket.set(String(user._id), ws);

    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    ws.on("close", function close() {
      UserSocket.delete(String(user._id));
    });
  });
};
